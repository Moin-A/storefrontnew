import { NextRequest } from 'next/server';
import { SolidusAPI } from "../../../../../service/api";

export async function POST(request: NextRequest) {
  try {
    const api = new SolidusAPI();
    const body = await request.json();
    const cookies = request.headers.get('cookie') || '';

    // Validate the request body structure
    if (!body.spree_user) {
      return new Response(
        JSON.stringify({ error: 'Invalid request format' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { reset_password_token, password, password_confirmation } = body.spree_user;

    // Validate required fields
    if (!reset_password_token || !password || !password_confirmation) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate password confirmation
    if (password !== password_confirmation) {
      return new Response(
        JSON.stringify({ error: 'Password confirmation does not match' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Call the upstream API to reset the password
    const response = await api.request(`api/auth/password/change`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Cookie': cookies
      },
      body: JSON.stringify({
        spree_user: {
          reset_password_token: reset_password_token,
          password: password,
          password_confirmation: password_confirmation
        }
      }),
      credentials: 'include' as RequestCredentials
    });

    // Get the response data
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = {};
    }

    // Return the response with appropriate status
    return new Response(
      JSON.stringify(responseData), 
      { 
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Password change error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
