// Standalone CommonJS / Node runner for production & direct execution
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

const DEFAULT_SHEET_ID = '1QuUEAhHn8qd5jm-1bbb5Mf4KdqcwRIT43trV_-cBFHY';
const SHEET_ID = process.env.GOOGLE_SHEETS_ID || DEFAULT_SHEET_ID;
const RANGE = 'Sheet1!A:H';

const memoryOrders = [];

function getSheets() {
  if (!process.env.GOOGLE_SHEETS_KEY) return null;
  try {
    const raw = Buffer.from(process.env.GOOGLE_SHEETS_KEY, 'base64').toString('utf8');
    const credentials = JSON.parse(raw);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return google.sheets({ version: 'v4', auth });
  } catch (e) {
    console.error('Google Sheets auth init error:', e.message);
    return null;
  }
}

app.post('/api/order', async (req, res) => {
  try {
    const { name, phone, email, notes } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Name required' });
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Valid 10-digit phone required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Valid email required' });
    }

    const orderId = `GOUT${Date.now()}`;
    const now = new Date().toISOString();
    const dateOrdered = new Date().toLocaleDateString('en-IN');
    const row = [now, name, phone, email, 'pending', orderId, dateOrdered, notes || 'Initial contact'];

    memoryOrders.unshift({ timestamp: now, name, phone, email, status: 'pending', orderId, dateOrdered, notes: notes || 'Initial contact' });

    const sheets = getSheets();
    if (sheets) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: RANGE,
        valueInputOption: 'RAW',
        requestBody: { values: [row] },
      });
    }

    res.json({
      success: true,
      orderId,
      message: 'Order placed successfully! Our team will call you soon.',
    });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

app.get('/api/order/:id', async (req, res) => {
  try {
    const sheets = getSheets();
    if (sheets) {
      const result = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: RANGE });
      const rows = result.data.values || [];
      const order = rows.find((r) => r[5] === req.params.id);
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
        });
      }
    }

    const local = memoryOrders.find((r) => r.orderId === req.params.id);
    if (local) return res.json(local);

    return res.status(404).json({ message: 'Order not found' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/orders', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (process.env.ADMIN_TOKEN && token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const sheets = getSheets();
    let orders = [];
    if (sheets) {
      const result = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: RANGE });
      const rows = result.data.values || [];
      orders = rows.slice(1).map((r) => ({
        timestamp: r[0],
        name: r[1],
        phone: r[2],
        email: r[3],
        status: r[4],
        orderId: r[5],
        dateOrdered: r[6],
        notes: r[7],
      }));
    }
    if (orders.length === 0) orders = memoryOrders;

    res.json({
      totalOrders: orders.length,
      orders,
      stats: {
        pending: orders.filter((o) => o.status === 'pending').length,
        confirmed: orders.filter((o) => o.status === 'confirmed').length,
        delivered: orders.filter((o) => o.status === 'delivered').length,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Static assets
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
