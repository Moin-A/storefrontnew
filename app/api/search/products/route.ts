import { NextRequest } from 'next/server';
import { SolidusAPI } from '../../../../service/api';
import { SOLIDUS_ROUTES } from '../../../../lib/routes';

export async function GET(request: NextRequest) {
  const api = new SolidusAPI();
  const { searchParams } = new URL(request.url);
  const cookies = request.headers.get('cookie') || '';

  const queryString = searchParams.toString();
  const endpoint = `${SOLIDUS_ROUTES.api.search_products}${queryString ? `?${queryString}` : ''}`;

  const response = await api.request(endpoint, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Cookie': cookies,
    },
    credentials: 'include' as RequestCredentials,
  });

  return response;
}

