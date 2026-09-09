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
  const targetId = req.query.id as string;
  if (!targetId) {
    return res.status(400).json({ message: 'Order ID is required' });
  }

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
        return res.status(200).json({
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
    } catch (err: any) {
      console.warn('Sheets lookup error:', err?.message);
    }
  }

  return res.status(404).json({ message: 'ऑर्डर नहीं मिला (Order not found)' });
}
