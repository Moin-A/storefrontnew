import { NextRequest, NextResponse } from 'next/server';
import { SolidusAPI } from '../../../../../service/api';


export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const cookies = request.headers.get('cookie') || '';
  
  const api = new SolidusAPI();
  
  const requestConfig = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies
    },
    credentials: 'include' as RequestCredentials
  };

  const endpoint = `api/checkouts/${id}/next`;
  const response = await api.request(endpoint, requestConfig);
  return response;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const cookies = request.headers.get('cookie') || '';
  
  const api = new SolidusAPI();
  
  const requestConfig = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies
    },
    credentials: 'include' as RequestCredentials
  };

  const endpoint = `api/checkouts/${id}/next`;
  const response = await api.request(endpoint, requestConfig);
  return response;
}
