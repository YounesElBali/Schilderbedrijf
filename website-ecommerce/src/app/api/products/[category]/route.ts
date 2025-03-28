import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  console.log('API Route: Fetching products for category:', params.category);
  
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          name: params.category,
        },
      },
      include: {
        category: true,
      },
    });
    
    console.log('API Route: Found products:', products);
    return NextResponse.json(products);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { message: 'Error fetching products' },
      { status: 500 }
    );
  }
} 