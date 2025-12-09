import { NextRequest } from "next/server";
import { SolidusAPI } from '../../../../../service/api';
import { SOLIDUS_ROUTES } from '../../../../../lib/routes';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const api = new SolidusAPI();
  const { id } = await params;

  const { lineItemId, rating, comment } = await request.json();

  const cookies = request.headers.get('cookie') || '';

  const requestConfig = {
    method: 'POST',
    body: JSON.stringify({
      lineItemId,
      rating,
      comment
    }),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cookie': cookies
    },
    credentials: 'include' as RequestCredentials
  };

  const response = await api.request(SOLIDUS_ROUTES.api.review_product(id), requestConfig);
  
  return response;
}

