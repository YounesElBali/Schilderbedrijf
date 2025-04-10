import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Fetch the first 3 products, ordered by their creation or ID (whichever is appropriate)
    const recommendedProducts = await prisma.product.findMany({
      take: 3,  // Limit to 3 products
      orderBy: {
        id: 'asc',  // Order by ascending ID (or use 'createdAt' if you prefer)
      },
    });

    return NextResponse.json(recommendedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 }
    );
  }
}
