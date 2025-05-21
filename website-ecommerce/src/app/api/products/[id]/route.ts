import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const productId = (await params).id;
    const idNumber = parseInt(productId);
    

    const product = await prisma.product.findUnique({
      where: { id: idNumber },
      include: { 
        category: true,
        variants: true,
        traits: true ,
        Imges:true// Include variants in the response
      }
    });
    
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Error fetching product" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const productId = (await params).id;
    const idNumber = parseInt(productId);
    
    if (isNaN(idNumber)) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, price, image, categoryId, isNew, inStock, articlenr } = body;

    const product = await prisma.product.update({
      where: { id: idNumber },
      data: {
        name,
        description,
        price,
        image,
        categoryId,
        isNew,
        inStock,
        articlenr,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "Error updating product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const productId = (await params).id;
    const idNumber = parseInt(productId);

    if (isNaN(idNumber)) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: idNumber },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    await prisma.product.delete({
        where: { id: idNumber },
    });

    return NextResponse.json({ 
      message: "Product deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Error deleting product" },
      { status: 500 }
    );
  };
} 