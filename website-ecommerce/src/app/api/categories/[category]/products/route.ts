import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const resolvedParams = await params;
    const categorySlug = resolvedParams.category;

    if (!categorySlug) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Category parameter is required" 
        },
        { status: 400 }
      );
    }

    // Find the category by both path and name (case-insensitive)
    const category = await prisma.category.findFirst({
      where: {
        OR: [
          {
            path: {
              equals: categorySlug
            }
          },
          {
            name: {
              equals: categorySlug
            }
          },
          // Also try with contains for partial matches
          {
            path: {
              contains: categorySlug
            }
          },
          {
            name: {
              contains: categorySlug
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        path: true,
        image: true
      }
    });

    if (!category) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Category not found',
          searchedFor: categorySlug 
        },
        { status: 404 }
      );
    }

    // Fetch products for this category
// Alternative using include instead of select
const products = await prisma.product.findMany({
  where: {
    categoryId: category.id
  },
  orderBy: {
    name: 'asc'
  },
  include: {
    images: true
  }
});

    return NextResponse.json({
      success: true,
      category,
      products,
      total: products.length
    });

  } catch (error) {
    console.error('Error fetching products by category:', error);
    
    const resolvedParams = await params;
    return NextResponse.json(
      {
        success: false, 
        error: "Internal server error while fetching products by category",
        searchedFor: resolvedParams.category 
      },
      { status: 500 }
    );
  }
}