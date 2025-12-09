import { NextRequest, NextResponse } from 'next/server';
import { SolidusAPI } from '../../../../service/api';

export async function GET(req: NextRequest) {
    console.log('Top rated route hit!', req.url);
    
    try {
        const { searchParams } = new URL(req.url);
        const permalink = searchParams.get('permalink');
        const limit = searchParams.get('limit');

        if (!permalink) {
            return NextResponse.json(
                { error: 'permalink parameter is required' },
                { status: 400 }
            );
        }

        const api = new SolidusAPI();
        const cookies = req.headers.get('cookie') || '';

        const requestConfig = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': cookies
            },
            credentials: 'include' as RequestCredentials
        };

        const response = await api.request(`/api/products/top_rated?permalink=${encodeURIComponent(permalink)}&&limit=${limit}`, requestConfig);

        return response;
    } catch (error) {
        console.error('Error in top_rated route:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

