import { NextRequest } from "next/server";
import { SolidusAPI } from '../../../../service/api';

export async function POST(request: NextRequest) {
    const api = new SolidusAPI();
    
        
    const { variant_id, quantity } = await request.json();

    const cookies = request.headers.get('cookie') || '';

    const requestConfig = {
        method: 'POST',
        body: JSON.stringify({
            line_item: {
                variant_id,
                quantity: quantity || 1
            }
        }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': cookies
        },
        credentials: 'include' as RequestCredentials
    };

    const response = await api.request('/api/orders/current/line_items', requestConfig);
        
    return response;
    
         
}