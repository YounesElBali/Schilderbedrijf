import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check if the id is a number (product id) or a string (category name)
    const isNumeric = /^\d+$/.test((await context.params).id);
    
    if (isNumeric) {
      // If numeric, fetch a single product
      const product = await prisma.product.findUnique({
        where: { id: parseInt((await context.params).id) },
        include: { category: true }
      });
      
      if (!product) {
        return NextResponse.json(
          { message: "Product not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json(product);
    } else {
      // If string, fetch products by category name
      const products = await prisma.product.findMany({
        where: {
          category: {
            name: (await context.params).id,
          },
        },
        include: {
          category: true,
        },
      });
      
      return NextResponse.json(products);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const productId = parseInt((await context.params).id);

    // First get the product to get the image path
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Delete the product
    await prisma.product.delete({
      where: { id: productId },
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
  }
} 