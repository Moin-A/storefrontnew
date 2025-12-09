import { NextRequest, NextResponse } from 'next/server';
import { SolidusAPI } from '../../../service/api';


export async function POST(request: NextRequest) {
    const cookies = request.headers.get('cookie') || '';
 
    const body = await request.json();
    
    const api = new SolidusAPI();
   
    const requestConfig =  {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
      body: JSON.stringify(body),
      credentials: 'include' as RequestCredentials
    };

    const endpoint = `api/addresses`
   	const response = await api.request(endpoint, requestConfig);
    return response
  
}



export async function GET(request: NextRequest,
  { params }: { params: { id: string } }
) {


   const api = new SolidusAPI();
   
   const cookies = request.headers.get('cookie') || '';
   
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
        credentials: 'include' as RequestCredentials
    };
    const endpoint = `api/addresses`
    const response = await api.request(endpoint, config)
      
    
    return response;

}
