import { SolidusAPI } from '../../../service/api';
import {SOLIDUS_ROUTES} from "../../../lib/routes";

export async function GET(request: Request) {
    
    const { searchParams } = new URL(request.url);
    
    let response;
    const api = new SolidusAPI();
    const taxon_id = searchParams.get('taxon_id');
    const perma_link = searchParams.get('perma_link');
    const page = searchParams.get('page');
    
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
    
    if (taxon_id) {
        response = await api.request(SOLIDUS_ROUTES.api.products + `?taxon_id=${taxon_id}` + `&&page=${page}` , requestConfig);
    } else {
        response = await api.request(SOLIDUS_ROUTES.api.products + `?perma_link=${perma_link}` + `&&page=${page}`, requestConfig);    
    }
    
    return response;

}