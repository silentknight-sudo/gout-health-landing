import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Security and middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(cors());
app.use(express.json());

// In-memory fallback database for orders (ensures seamless operation even before credentials are set)
interface OrderRecord {
  timestamp: string;
  name: string;
  phone: string;
  email: string;
  status: 'pending' | 'confirmed' | 'delivered';
  orderId: string;
  dateOrdered: string;
  notes: string;
  address?: string;
  combo?: string;
}

const localOrders: OrderRecord[] = [
  {
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    name: 'रमेश शर्मा',
    phone: '9829012345',
    email: 'ramesh.sharma@example.com',
    status: 'confirmed',
    orderId: 'GOUT1725881200001',
    dateOrdered: new Date(Date.now() - 3600000 * 2).toLocaleDateString('en-IN'),
    notes: 'COD ऑर्डर - 60 दिन कंप्लीट हीलिंग पैक',
    address: 'प्लॉट 42, मालवीय नगर, जयपुर, राजस्थान',
    combo: '60-Day Healing Pack',
  },
  {
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    name: 'सुनीता देवी',
    phone: '9415098765',
    email: 'sunita.devi@example.com',
    status: 'pending',
    orderId: 'GOUT1725881200002',
    dateOrdered: new Date(Date.now() - 3600000 * 5).toLocaleDateString('en-IN'),
    notes: 'COD ऑर्डर - पैर के अंगूठे में सूजन',
    address: 'सेक्टर 14, इंदिरा नगर, लखनऊ, उत्तर प्रदेश',
    combo: '60-Day Healing Pack',
  },
];

const DEFAULT_SHEET_ID = '1QuUEAhHn8qd5jm-1bbb5Mf4KdqcwRIT43trV_-cBFHY';

function parseSpreadsheetId(input?: string): string {
  if (!input) return DEFAULT_SHEET_ID;
  const trimmed = input.trim();
  // If user pasted a full Google Sheets URL like https://docs.google.com/spreadsheets/d/<ID>/edit
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

const SHEET_ID = parseSpreadsheetId(process.env.GOOGLE_SHEETS_ID);
const RANGE = 'Sheet1!A:K';

function normalizeIndianPhone(input?: string): string {
  if (!input) return '';
  let clean = input.toString().trim().replace(/[\s\-\(\)\+\.]/g, '');
  if (clean.startsWith('0') && clean.length === 11) {
    clean = clean.slice(1);
  } else if (clean.startsWith('91') && clean.length === 12) {
    clean = clean.slice(2);
  }
  return clean;
}

// Google Sheets client helper
function getGoogleSheetsClient() {
  const keyBase64 = process.env.GOOGLE_SHEETS_KEY;
  if (!keyBase64) {
    return null;
  }

  try {
    let keyJsonStr: string;
    try {
      keyJsonStr = Buffer.from(keyBase64, 'base64').toString('utf-8');
      // Verify if valid JSON
      JSON.parse(keyJsonStr);
    } catch {
      // Maybe raw JSON string was provided
      keyJsonStr = keyBase64;
    }

    const credentials = JSON.parse(keyJsonStr);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({ version: 'v4', auth });
  } catch (err) {
    console.error('Failed to initialize Google Sheets client:', err);
    return null;
  }
}

// Check configuration status
app.get('/api/config/status', (req, res) => {
  const isKeyPresent = Boolean(process.env.GOOGLE_SHEETS_KEY);
  res.json({
    sheetsConfigured: isKeyPresent,
    sheetId: SHEET_ID,
    sheetUrl: `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`,
    defaultRange: RANGE,
    adminTokenSet: Boolean(process.env.ADMIN_TOKEN),
  });
});

// Create Order (POST /api/order)
app.post('/api/order', async (req, res) => {
  try {
    const { name, phone, email, address, notes, combo, utmSource, utmMedium, utmCampaign } = req.body;

    // Validation: Only Name and Phone are required
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'नाम दर्ज करना आवश्यक है (Name is required)' });
    }

    const cleanPhone = normalizeIndianPhone(phone);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'कृपया 10 अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें (Valid 10-digit Indian phone starting with 6-9 is required)',
      });
    }

    const cleanEmail = (email || '').toString().trim() || '-';

    // Deduplication Guard: Check if an order was placed with this phone number within the last 30 minutes
    const recentDuplicate = localOrders.find((ord) => {
      if (ord.phone !== cleanPhone) return false;
      const orderTime = new Date(ord.timestamp).getTime();
      const diffMinutes = (Date.now() - orderTime) / (1000 * 60);
      return diffMinutes < 30;
    });

    if (recentDuplicate) {
      console.log(`[Deduplication] Duplicate order detected for phone ${cleanPhone}. Returning existing Order ID: ${recentDuplicate.orderId}`);
      return res.json({
        success: true,
        orderId: recentDuplicate.orderId,
        isDuplicate: true,
        syncedToSheets: true,
        orderDetails: recentDuplicate,
        message: `आपका ऑर्डर पहले ही सफलतापूर्वक दर्ज हो चुका है (Order ID: ${recentDuplicate.orderId})। हमारी टीम शीघ्र ही आपसे कॉल पर संपर्क करेगी।`,
      });
    }

    // Generate Order ID
    const orderId = `GOUT${Date.now()}`;
    const now = new Date().toISOString();
    const dateOrdered = new Date().toLocaleDateString('en-IN');
    const orderNotes = notes || (address ? `COD Address: ${address}` : 'COD Order (Name & Phone lead - awaiting call confirmation)');

    // Store in local backup
    const newRecord: OrderRecord = {
      timestamp: now,
      name: name.trim(),
      phone: cleanPhone,
      email: cleanEmail,
      status: 'pending',
      orderId,
      dateOrdered,
      notes: orderNotes,
      address: address ? address.trim() : undefined,
      combo: combo || 'Gouthealth 60-Day Complete Healing Pack',
    };
    localOrders.unshift(newRecord);

    let syncedToSheets = false;
    let sheetError: string | null = null;

    const sheetsClient = getGoogleSheetsClient();
    if (sheetsClient) {
      try {
        const row = [
          now, // A: Timestamp
          name.trim(), // B: Name
          cleanPhone, // C: Phone
          cleanEmail, // D: Email
          'pending', // E: Status
          orderId, // F: Order ID
          dateOrdered, // G: Date Ordered
          orderNotes, // H: Notes
          utmSource || 'direct', // I: Utm_source
          utmMedium || '', // J: Utm_medium
          utmCampaign || '', // K: Utm_campaign
        ];

        await sheetsClient.spreadsheets.values.append({
          spreadsheetId: SHEET_ID,
          range: RANGE,
          valueInputOption: 'RAW',
          requestBody: { values: [row] },
        });
        syncedToSheets = true;
        console.log('Order appended to Google Sheets successfully:', orderId);
      } catch (err: any) {
        console.error('Google Sheets append error:', err?.message || err);
        sheetError = err?.message || 'Google Sheets sync failed';
      }
    } else {
      console.log('Note: GOOGLE_SHEETS_KEY not provided. Order saved to local fallback memory.');
    }

    return res.json({
      success: true,
      orderId,
      syncedToSheets,
      sheetError,
      orderDetails: newRecord,
      message: 'ऑर्डर सफलतापूर्वक दर्ज कर लिया गया है! हमारी टीम शीघ्र ही आपसे कॉल पर संपर्क करेगी। (Order placed successfully! Our team will call you soon.)',
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// Get Order by ID (GET /api/order/:id)
app.get('/api/order/:id', async (req, res) => {
  try {
    const targetId = req.params.id;
    const sheetsClient = getGoogleSheetsClient();

    if (sheetsClient) {
      try {
        const result = await sheetsClient.spreadsheets.values.get({
          spreadsheetId: SHEET_ID,
          range: RANGE,
        });

        const rows = result.data.values || [];
        const order = rows.find((row) => row[5] === targetId);

        if (order) {
          return res.json({
            timestamp: order[0],
            name: order[1],
            phone: order[2],
            email: order[3],
            status: order[4],
            orderId: order[5],
            dateOrdered: order[6],
            notes: order[7],
            source: 'google_sheets',
          });
        }
      } catch (err) {
        console.warn('Google Sheets query error, falling back to local memory:', err);
      }
    }

    // Fallback search in local database
    const local = localOrders.find((o) => o.orderId === targetId);
    if (!local) {
      return res.status(404).json({ message: 'ऑर्डर नहीं मिला (Order not found)' });
    }

    return res.json({
      timestamp: local.timestamp,
      name: local.name,
      phone: local.phone,
      email: local.email,
      status: local.status,
      orderId: local.orderId,
      dateOrdered: local.dateOrdered,
      notes: local.notes,
      source: 'local_store',
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin - Get All Orders (GET /api/admin/orders)
app.get('/api/admin/orders', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.query.token;
    const expectedToken = process.env.ADMIN_TOKEN;

    // Check token if set
    if (expectedToken && token !== expectedToken) {
      return res.status(401).json({ message: 'अनधिकृत पहुंच (Unauthorized - Invalid Admin Token)' });
    }

    const sheetsClient = getGoogleSheetsClient();
    let orders: any[] = [];
    let dataSource = 'local_store';

    if (sheetsClient) {
      try {
        const result = await sheetsClient.spreadsheets.values.get({
          spreadsheetId: SHEET_ID,
          range: RANGE,
        });

        const rows = result.data.values || [];
        if (rows.length > 1) {
          orders = rows.slice(1).map((row) => ({
            timestamp: row[0] || '',
            name: row[1] || '',
            phone: row[2] || '',
            email: row[3] || '',
            status: row[4] || 'pending',
            orderId: row[5] || '',
            dateOrdered: row[6] || '',
            notes: row[7] || '',
          }));
          dataSource = 'google_sheets';
        }
      } catch (err) {
        console.warn('Sheets fetch error for admin, falling back to local:', err);
      }
    }

    if (orders.length === 0) {
      orders = localOrders;
      dataSource = 'local_store';
    }

    return res.json({
      totalOrders: orders.length,
      dataSource,
      sheetId: SHEET_ID,
      orders,
      stats: {
        pending: orders.filter((o) => o.status === 'pending').length,
        confirmed: orders.filter((o) => o.status === 'confirmed').length,
        delivered: orders.filter((o) => o.status === 'delivered').length,
      },
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gouthealth Server running on http://localhost:${PORT}`);
    console.log(`Google Sheets integration active for ID: ${SHEET_ID}`);
  });
}

startServer();
