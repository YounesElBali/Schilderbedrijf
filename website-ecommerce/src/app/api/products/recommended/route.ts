import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { categories, excludeIds } = await request.json();

    // Fetch products from the same categories, excluding items already in cart
    const recommendedProducts = await prisma.product.findMany({
      where: {
        category: {
          in: categories
        },
        id: {
          notIn: excludeIds
        }
      },
      take: 3, // Limit to 3 recommendations
      orderBy: {
        createdAt: 'desc' // Show newest products first
      }
    });

    return NextResponse.json(recommendedProducts);
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommended products' },
      { status: 500 }
    );
  }
} 