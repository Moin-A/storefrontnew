import { SolidusAPI } from '../../../../../service/api';
import { SOLIDUS_ROUTES } from '../../../../../lib/routes';

export async function GET(request: Request, { params }: { params: { id: string } }) {
	const { id } = params;

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

	// Proxy to backend: GET /api/categories/:id/taxons

	const endpoint = SOLIDUS_ROUTES.api.category_taxons(`categories/${id}`);
	const response = await api.request(endpoint, requestConfig);

	return response;
}


