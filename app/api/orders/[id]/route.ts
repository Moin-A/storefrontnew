import { SolidusAPI } from '../../../../service/api'
import { SOLIDUS_ROUTES } from '../../../../lib/routes'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const api = new SolidusAPI()
  const { id } = await params
  const cookies = request.headers.get('cookie') || ''
  const { searchParams } = new URL(request.url)
  const query = searchParams.toString()
  const endpoint = `${SOLIDUS_ROUTES.api.orders}/${id}?order_id=${id}`

  const response = await api.request(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Cookie: cookies,
    },
    credentials: 'include' as RequestCredentials,
  })

  return response
}

