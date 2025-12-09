import { type NextRequest } from "next/server";
import { SolidusAPI } from "../../../../service/api";
import { SOLIDUS_ROUTES } from "../../../../lib/routes";


export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: storeId } = await params;

  const cookies = req.headers.get('cookie') || '';

  const requestConfig = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cookie': cookies
    },
    credentials: 'include' as RequestCredentials
  };

  const api = new SolidusAPI();
  
  const response = await api.request(`${SOLIDUS_ROUTES.api.stores}/${storeId}`, requestConfig);

  return response;
  
}
