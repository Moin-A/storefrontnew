import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest,
  { params }: { params: { order_id: string } }
) {

    const { order_id } = await params;
    const cookies = request.headers.get('cookie') || '';
    console.log('Fetching shipping methods for order ID:', `${process.env.API_URL}/api/orders/${order_id}/available_shipping_methods`);
    const response = await fetch(`${process.env.API_URL}/api/orders/${order_id}/available_shipping_methods`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
    });

    return response;

}
