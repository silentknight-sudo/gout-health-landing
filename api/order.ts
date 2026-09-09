import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

const DEFAULT_SHEET_ID = '1QuUEAhHn8qd5jm-1bbb5Mf4KdqcwRIT43trV_-cBFHY';

function parseSpreadsheetId(input?: string): string {
  if (!input) return DEFAULT_SHEET_ID;
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

const SHEET_ID = parseSpreadsheetId(process.env.GOOGLE_SHEETS_ID);
const RANGE = 'Sheet1!A:H';

function getGoogleSheetsClient() {
  const keyBase64 = process.env.GOOGLE_SHEETS_KEY;
  if (!keyBase64) {
    return null;
  }

  try {
    let keyJsonStr: string;
    try {
      keyJsonStr = Buffer.from(keyBase64, 'base64').toString('utf-8');
      JSON.parse(keyJsonStr);
    } catch {
      keyJsonStr = keyBase64;
    }

    const credentials = JSON.parse(keyJsonStr);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({ version: 'v4', auth });
  } catch (err) {
    console.error('Failed to initialize Google Sheets client in Vercel function:', err);
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-admin-token'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { name, phone, email, address, notes, combo } = req.body || {};

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'नाम दर्ज करना आवश्यक है (Name is required)' });
    }

    const cleanPhone = (phone || '').toString().trim().replace(/[\s-]/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'कृपया 10 अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें (Valid 10-digit Indian phone is required)',
      });
    }

    const cleanEmail = (email || '').toString().trim() || '-';
    const orderId = `GOUT${Date.now()}`;
    const now = new Date().toISOString();
    const dateOrdered = new Date().toLocaleDateString('en-IN');
    const orderNotes = notes || (address ? `COD Address: ${address}` : 'COD Order (Name & Phone lead - awaiting call confirmation)');

    const orderDetails = {
      timestamp: now,
      name: name.trim(),
      phone: cleanPhone,
      email: cleanEmail,
      status: 'pending',
      orderId,
      dateOrdered,
      notes: orderNotes,
      combo: combo || 'Gouthealth 60-Day Complete Healing Pack (₹1,999)',
    };

    let syncedToSheets = false;
    let sheetError: string | null = null;

    const sheetsClient = getGoogleSheetsClient();
    if (sheetsClient) {
      try {
        const row = [
          now,
          name.trim(),
          cleanPhone,
          cleanEmail,
          'pending',
          orderId,
          dateOrdered,
          orderNotes,
        ];

        await sheetsClient.spreadsheets.values.append({
          spreadsheetId: SHEET_ID,
          range: RANGE,
          valueInputOption: 'RAW',
          requestBody: { values: [row] },
        });
        syncedToSheets = true;
      } catch (err: any) {
        console.error('Google Sheets append error in Vercel function:', err?.message || err);
        sheetError = err?.message || 'Google Sheets sync failed';
      }
    } else {
      sheetError = 'GOOGLE_SHEETS_KEY environment variable is not configured on Vercel';
    }

    return res.status(200).json({
      success: true,
      orderId,
      syncedToSheets,
      sheetError,
      orderDetails,
      message: 'ऑर्डर सफलतापूर्वक दर्ज कर लिया गया है! हमारी टीम शीघ्र ही आपसे कॉल पर संपर्क करेगी। (Order placed successfully! Our team will call you soon.)',
    });
  } catch (error: any) {
    console.error('Order creation handler error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Internal server error' });
  }
}
