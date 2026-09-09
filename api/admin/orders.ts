import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

const DEFAULT_SHEET_ID = '1QuUEAhHn8qd5jm-1bbb5Mf4KdqcwRIT43trV_-cBFHY';

function parseSpreadsheetId(input?: string): string {
  if (!input) return DEFAULT_SHEET_ID;
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) return match[1];
  return trimmed;
}

const SHEET_ID = parseSpreadsheetId(process.env.GOOGLE_SHEETS_ID);
const RANGE = 'Sheet1!A:H';

function getGoogleSheetsClient() {
  const keyBase64 = process.env.GOOGLE_SHEETS_KEY;
  if (!keyBase64) return null;
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
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.query.token;
  const expectedToken = process.env.ADMIN_TOKEN;

  if (expectedToken && token !== expectedToken) {
    return res.status(401).json({ message: 'अनधिकृत पहुंच (Unauthorized - Invalid Admin Token)' });
  }

  const sheetsClient = getGoogleSheetsClient();
  let orders: any[] = [];
  let dataSource = 'empty';

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
    } catch (err: any) {
      console.warn('Sheets fetch error:', err?.message);
    }
  }

  return res.status(200).json({
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
}
