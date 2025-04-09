import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET a specific variant
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; variantId: string } }
) {
  try {
    const productId = parseInt(params.id);
    const variantId = parseInt(params.variantId);
    
    if (isNaN(productId) || isNaN(variantId)) {
      return NextResponse.json(
        { error: 'Invalid product or variant ID' },
        { status: 400 }
      );
    }

    const variant = await prisma.productVariant.findFirst({
      where: { 
        id: variantId,
        productId 
      },
    });

    if (!variant) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(variant);
  } catch (error) {
    console.error('Error fetching variant:', error);
    return NextResponse.json(
      { error: 'Failed to fetch variant' },
      { status: 500 }
    );
  }
}

// PATCH (update) a specific variant
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; variantId: string } }
) {
  try {
    const productId = parseInt(params.id);
    const variantId = parseInt(params.variantId);
    
    if (isNaN(productId) || isNaN(variantId)) {
      return NextResponse.json(
        { error: 'Invalid product or variant ID' },
        { status: 400 }
      );
    }

    const { name, price, inStock } = await request.json();

    const variant = await prisma.productVariant.update({
      where: { 
        id: variantId,
        productId 
      },
      data: {
        name: name !== undefined ? name : undefined,
        price: price !== undefined ? price : undefined,
        inStock: inStock !== undefined ? inStock : undefined,
      },
    });

    return NextResponse.json(variant);
  } catch (error) {
    console.error('Error updating variant:', error);
    return NextResponse.json(
      { error: 'Failed to update variant' },
      { status: 500 }
    );
  }
}

// DELETE a specific variant
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; variantId: string } }
) {
  try {
    const productId = parseInt(params.id);
    const variantId = parseInt(params.variantId);
    
    if (isNaN(productId) || isNaN(variantId)) {
      return NextResponse.json(
        { error: 'Invalid product or variant ID' },
        { status: 400 }
      );
    }

    await prisma.productVariant.delete({
      where: { 
        id: variantId,
        productId 
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting variant:', error);
    return NextResponse.json(
      { error: 'Failed to delete variant' },
      { status: 500 }
    );
  }
} 