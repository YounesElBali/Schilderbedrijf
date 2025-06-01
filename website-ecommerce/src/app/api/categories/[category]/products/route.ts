import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    // First find the category by name
    const category = await prisma.category.findFirst({
      where: {
        name: {
          equals: (await params).category,
        }
      }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Then fetch products for this category
    const products = await prisma.product.findMany({
      where: {
        categoryId: category.id
      },
      orderBy: {
        name: 'asc'
      },
      include: {
        images: true,  // or whatever your relation field name is
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return NextResponse.json(
      { error: 'Error fetching products by category' },
      { status: 500 }
    );
  }
} 