import { google } from 'googleapis';

export async function getSpreadsheetValues(spreadsheetId: string) {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // 1. Get spreadsheet metadata to find all sheet names
        const meta = await sheets.spreadsheets.get({
            spreadsheetId,
        });

        const title = meta.data.properties?.title || 'Untitled Sheet';
        const sheetNames = meta.data.sheets?.map(s => s.properties?.title).filter(Boolean) as string[] || [];

        // 2. Fetch data from all sheets (or just the first one for speed if no range specified)
        // For Context RAG, likely want all textual data.
        const dataRanges = sheetNames.map(name => `${name}!A1:Z50`); // Limit range to avoid token blowout

        const response = await sheets.spreadsheets.values.batchGet({
            spreadsheetId,
            ranges: dataRanges,
        });

        return {
            title,
            sheets: response.data.valueRanges?.map((range, index) => ({
                name: sheetNames[index],
                values: range.values
            })) || []
        };

    } catch (error) {
        console.error('Error fetching sheet:', error);
        throw error;
    }
}
