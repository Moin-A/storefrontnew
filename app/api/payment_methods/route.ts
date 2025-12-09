import { SolidusAPI } from '../../../service/api'
import { SOLIDUS_ROUTES } from '../../../lib/routes'

export async function GET(request: Request) {
  const api = new SolidusAPI()
  const cookies = request.headers.get('cookie') || ''
  const { searchParams } = new URL(request.url)
  const queryString = searchParams.toString()
  const endpoint = `${SOLIDUS_ROUTES.api.payment_methods}${queryString ? `?${queryString}` : ''}`

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

