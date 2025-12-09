import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookies = request.headers.get('cookie') || '';
   

  
    // Fetch user orders from Solidus API
    const response = await fetch(`${process.env.API_URL}/api/orders`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
    });

    if (!response.ok) {
      throw new Error(`Solidus API error: ${response.status}`);
    }

    const orders = await response.json();
    return NextResponse.json(orders);

  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
