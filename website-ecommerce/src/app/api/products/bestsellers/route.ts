import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get top 5 bestsellers ordered by rank
    const bestsellers = await prisma.bestseller.findMany({
      take: 5,
      include: {
        product: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        rank: 'asc'
      }
    });

    // If no bestsellers found, return empty array
    if (!bestsellers || bestsellers.length === 0) {
      return NextResponse.json([]);
    }

    // Format the response to match the expected structure
    const formattedProducts = bestsellers.map(bestseller => ({
      id: bestseller.product.id,
      name: bestseller.product.name,
      price: bestseller.product.price,
      image: bestseller.product.image,
      isNew: bestseller.product.isNew,
      category: bestseller.product.category
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching bestsellers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bestsellers' },
      { status: 500 }
    );
  }
} 