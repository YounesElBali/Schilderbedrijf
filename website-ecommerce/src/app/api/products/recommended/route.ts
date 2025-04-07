import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { categories, excludeIds } = await request.json();
    
    // Fetch products from the same categories, excluding items already in cart
    const recommendedProducts = await prisma.product.findMany({
      where: {
        categoryId: {
          in: categories.map((id: string) => parseInt(id))
        },
        id: {
          notIn: excludeIds
        }
      },
      take: 3,
      orderBy: {
        id: "desc"
      }
    });

    return NextResponse.json(recommendedProducts);
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    return NextResponse.json(
      { error: 'Error fetching recommended products' },
      { status: 500 }
    );
  }
} 