import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        variants:true,
        images:true,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, price, image, categoryId, isNew, inStock, articlenr, traits, iconIds} = await request.json();

    if (!name || !price || !image || !categoryId || !articlenr) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        traits,
        description,
        price: parseFloat(price),
        categoryId: parseInt(categoryId),
        isNew: isNew || false,
        inStock: inStock || true,
        
      articlenr,
       images: {
          create: image.map((img: { url: string }) => ({
            url: img.url,
          })),
        },
     
        productImages: iconIds && iconIds.length > 0
          ? {
              create: iconIds.map((iconId: number) => ({
                productImage: {
                  connect: { id: iconId },
                },
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
        productImages: {
          include: {
            productImage: true,
          },
        },
      },
    });
 

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating product" },
      { status: 500 }
    );
  }
} 