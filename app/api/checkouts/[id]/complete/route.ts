import { NextRequest, NextResponse } from 'next/server';
import { SolidusAPI } from '../../../../../service/api';


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const cookies = request.headers.get('cookie') || '';
  const body = await request.json();
  const api = new SolidusAPI();
  
  const requestConfig = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies
    },
    credentials: 'include' as RequestCredentials,
    body: JSON.stringify(body)
  };

  const endpoint = `api/checkouts/${id}/complete`;
  const response = await api.request(endpoint, requestConfig);
  return response;
}
