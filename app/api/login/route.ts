import { SolidusAPI } from '../../../service/api';
import {SOLIDUS_ROUTES} from "../../../lib/routes";

export async function POST(request: Request) {
    
    const api = new SolidusAPI();
   
    const body = await request.json();
    
    const cookies = request.headers.get('cookie') || '';
   
    const requestConfig = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': cookies
        },
        credentials: 'include' as RequestCredentials
    };
   
    const response = await api.request(SOLIDUS_ROUTES.api.login, requestConfig);
    
    return response;
    
}