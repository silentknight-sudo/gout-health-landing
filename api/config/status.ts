import type { VercelRequest, VercelResponse } from '@vercel/node';

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

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const isKeyPresent = Boolean(process.env.GOOGLE_SHEETS_KEY);
  return res.status(200).json({
    sheetsConfigured: isKeyPresent,
    sheetId: SHEET_ID,
    sheetUrl: `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`,
    defaultRange: 'Sheet1!A:H',
    adminTokenSet: Boolean(process.env.ADMIN_TOKEN),
  });
}
