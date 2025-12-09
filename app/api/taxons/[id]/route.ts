import { SolidusAPI } from '../../../../service/api';
import { SOLIDUS_ROUTES } from '../../../../lib/routes';

export async function GET(request: Request,  { params }: { params: { id: string } }) {
	const {id} = await params;

	const api = new SolidusAPI();

	const cookies = request.headers.get('cookie') || '';

	const requestConfig = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Cookie': cookies
		},
		credentials: 'include' as RequestCredentials
	};

	// Treat the dynamic `id` segment as the permalink
	const endpoint = `${SOLIDUS_ROUTES.api.taxons}/${encodeURIComponent(id)}`;
	const response = await api.request(endpoint, requestConfig);

	return response;
}


