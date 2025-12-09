import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mock reviews data - replace with actual API integration
const mockReviews = [
  {
    id: 1,
    productId: 1,
    productName: 'Wireless Headphones',
    rating: 5,
    comment: 'Excellent sound quality and comfortable fit!',
    date: '2024-01-15',
    productImage: '/placeholder-product.jpg',
    userName: 'John Doe'
  },
  {
    id: 2,
    productId: 2,
    productName: 'Smart Watch',
    rating: 4,
    comment: 'Great features, battery could be better.',
    date: '2024-01-10',
    productImage: '/placeholder-product.jpg',
    userName: 'John Doe'
  }
];

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('spree_api_key')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, return mock data
    // TODO: Integrate with actual reviews API
    return NextResponse.json(mockReviews);

  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('spree_api_key')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // TODO: Create review via actual API
    // For now, return mock response
    const newReview = {
      id: Date.now(),
      ...body,
      date: new Date().toISOString().split('T')[0],
      userName: 'John Doe'
    };

    return NextResponse.json(newReview);

  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
