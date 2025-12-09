import { NextRequest } from 'next/server';
import { SolidusAPI } from '../../../../../service/api';

// Proxies GET /api/password/recover?email=... to the upstream API server
export async function POST(request: NextRequest) {
  const api = new SolidusAPI();
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') || '';
  const cookies = request.headers.get('cookie') || '';

  // Call the upstream path. If your upstream expects a different path or POST, adjust here.
  const response = await api.request(`api/auth/password/recover`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Cookie': cookies
    },
    body: JSON.stringify({ "spree_user": { "email": email } }),
    credentials: 'include' as RequestCredentials
  });

  return response;
}




