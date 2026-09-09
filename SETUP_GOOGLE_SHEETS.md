# Google Sheets Integration Setup Guide for Gouthealth

This guide explains how to connect your Gouthealth order form to your Google Sheet (`1QuUEAhHn8qd5jm-1bbb5Mf4KdqcwRIT43trV_-cBFHY`).

---

## 1. Sheet Structure

In your Google Sheet (`Sheet1`), ensure the following columns are present in row 1:

| Col | Header | Description |
|---|---|---|
| **A** | Timestamp | Auto-generated ISO timestamp |
| **B** | Name | Customer's full name |
| **C** | Phone | 10-digit Indian phone number |
| **D** | Email | Customer's email address |
| **E** | Status | Order status (`pending` / `confirmed` / `delivered`) |
| **F** | Order ID | Unique ID (e.g., `GOUT1725883921000`) |
| **G** | Date Ordered | Formatted Indian date (e.g., `9/9/2026`) |
| **H** | Notes | Order notes & delivery details |

---

## 2. Google Cloud Setup

### Step 1: Create Google Cloud Project
1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown and select **New Project**.
3. Name it **Gouthealth** and click **Create**.

### Step 2: Enable Google Sheets API
1. Navigate to **APIs & Services** > **Library**.
2. Search for **Google Sheets API**.
3. Click **Enable**.

### Step 3: Create Service Account
1. Go to **APIs & Services** > **Credentials**.
2. Click **Create Credentials** > **Service Account**.
3. Service account name: `gouthealth-app`.
4. Click **Create and Continue**, then click **Done**.

### Step 4: Generate JSON Key
1. Click on the newly created service account in the list.
2. Go to the **Keys** tab.
3. Click **Add Key** > **Create new key**.
4. Choose **JSON** and click **Create**. The key file will download to your computer.

### Step 5: Share Your Google Sheet with the Service Account
1. Open your downloaded JSON key file in a text editor.
2. Find the `"client_email"` property (e.g. `gouthealth-app@your-project.iam.gserviceaccount.com`).
3. Open your Google Sheet (`1QuUEAhHn8qd5jm-1bbb5Mf4KdqcwRIT43trV_-cBFHY`).
4. Click the green **Share** button in the top right.
5. Paste the service account's client email address.
6. Set permission to **Editor** and click **Send / Share**.

---

## 3. Configure Environment Variables

### Encode Key to Base64
Run the following command in your terminal:

**On macOS / Linux:**
```bash
cat service-account-key.json | base64 | pbcopy
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("service-account-key.json")) | Set-Clipboard
```

### Add to `.env`
Set the environment variable:
```env
GOOGLE_SHEETS_KEY=<paste_base64_encoded_string_here>
GOOGLE_SHEETS_ID=1QuUEAhHn8qd5jm-1bbb5Mf4KdqcwRIT43trV_-cBFHY
ADMIN_TOKEN=your_secure_admin_token_here
```

---

## 4. Testing the Integration

- Start the server: `npm run dev`
- Fill out the COD order form on the landing page.
- Check both the web UI success notification and your Google Sheet. The new row will appear immediately with status `pending`.
- Inspect `/api/order/:id` or access the built-in Order Inspector / Admin view to verify live entries.
