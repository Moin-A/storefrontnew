import { SolidusAPI } from '../../../../service/api';

export async function GET(request: Request,
    { params }: { params: { id: string } }
) {
    const {id} = await params;
    
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
  
    const response = await api.request(`/api/products/${id}`, requestConfig);
    
    return response;
    
}