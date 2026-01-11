import { NextRequest, NextResponse } from 'next/server';
import { getSpreadsheetValues } from '@/lib/google/sheets';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const sheetId = searchParams.get('id');

    if (!sheetId) {
        return NextResponse.json({ error: 'Missing sheet ID' }, { status: 400 });
    }

    try {
        const data = await getSpreadsheetValues(sheetId);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch sheet', details: error.message },
            { status: 500 }
        );
    }
}
