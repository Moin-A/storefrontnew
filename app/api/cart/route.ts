import { NextRequest } from "next/server";
import { SolidusAPI } from '../../../service/api';

export async function GET(request: NextRequest) {
    const api = new SolidusAPI();
    
    const cookies = request.headers.get('cookie') || '';

    const requestConfig = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': cookies
        },
        credentials: 'include' as RequestCredentials
    };

    const response = await api.request('/cart', requestConfig);

    return response;
    
}

