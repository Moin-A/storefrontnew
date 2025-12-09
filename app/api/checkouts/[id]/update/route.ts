import { NextRequest, NextResponse } from 'next/server';
import { SolidusAPI } from '../../../../../service/api';


export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const {id} = await params;
  const cookies = request.headers.get('cookie') || '';
  const body = await request.json();
  
  const api = new SolidusAPI();
  
  const requestConfig = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies
    },
    body: JSON.stringify(body),
    credentials: 'include' as RequestCredentials
  };

  const endpoint = `api/checkouts/${id}`;
  const response = await api.request(endpoint, requestConfig);
  return response;
}
