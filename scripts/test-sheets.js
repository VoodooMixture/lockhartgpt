const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Manually load .env.local or .env
try {
    let envPath = path.resolve(__dirname, '../.env.local');
    if (!fs.existsSync(envPath)) {
        envPath = path.resolve(__dirname, '../.env');
    }

    if (fs.existsSync(envPath)) {
        console.log(`Loading env from: ${envPath}`);
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const [key, ...values] = line.split('=');
            if (key && values.length > 0) {
                // Remove quotes and whitespace
                let val = values.join('=').trim();
                // Check if it's double-quoted
                if (val.startsWith('"') && val.endsWith('"')) {
                    val = val.slice(1, -1);
                    // Handle escaped newlines in quoted strings
                    val = val.replace(/\\n/g, '\n');
                }
                process.env[key.trim()] = val;
            }
        });
    } else {
        console.error('No .env or .env.local file found!');
    }
} catch (e) {
    console.error('Error loading env file', e);
}

async function testSheet() {
    console.log('Testing Google Sheets Connection...');
    const email = process.env.GOOGLE_CLIENT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY;

    if (!email || !key) {
        console.error('MISSING CREDENTIALS:');
        console.error('Email:', email ? 'Present' : 'Missing');
        console.error('Key:', key ? 'Present' : 'Missing');
        return;
    }

    console.log('Client Email:', email);
    console.log('Key Length:', key.length);

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: email,
                private_key: key.replace(/\\n/g, '\n'), // Ensure newlines are handled
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Use the new Sample A ID
        const spreadsheetId = '1hgpRGg5aX1zwr0SFpvNYeXRl5HdGqQX22t5hXcOcHZw';
        console.log(`Attempting to access Sheet: ${spreadsheetId}`);

        const response = await sheets.spreadsheets.get({
            spreadsheetId,
        });

        console.log('SUCCESS! Sheet Title:', response.data.properties.title);

        const sheetNames = response.data.sheets.map(s => s.properties.title);
        console.log('Sheets found:', sheetNames);

    } catch (error) {
        console.error('CONNECTION FAILED:');
        console.error(error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Status Text:', error.response.statusText);
        }
    }
}

testSheet();
