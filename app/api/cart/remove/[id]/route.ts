import { NextRequest } from "next/server";
import { SolidusAPI } from '../../../../../service/api';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    const api = new SolidusAPI();
    
    const cookies = request.headers.get('cookie') || '';

    const requestConfig = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': cookies
        },
        credentials: 'include' as RequestCredentials
    };

    const response = await api.request(`/api/orders/current/line_items/${id}`, requestConfig);
    
    return response;
    
}

