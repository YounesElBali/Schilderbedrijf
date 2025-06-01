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
        images: true, // include the actual Image data (id, url)
        productImages: {
            include: {
              productImage: true, // include the actual Icon data (id, name, url)
            },
          },
      },
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
    const { name, description, price, images, categoryId, isNew, inStock, articlenr, traits,iconIds } = body;
  // 1. Verwijder bestaande relaties
await prisma.productProductImage.deleteMany({
  where: { productId: idNumber }
});

// 2. Voeg nieuwe relaties toe via de join table
await prisma.productProductImage.createMany({
  data: iconIds.map((iconId: number) => ({
    productId: idNumber,
    productImageId: iconId,
  })),
});

// 3. Update product zelf zonder connect/disconnect op productImages
const product = await prisma.product.update({
  where: { id: idNumber },
  data: {
    name,
    description,
    traits,
    price,
    
    categoryId,
    isNew,
    inStock,
    articlenr,
     images: {
          create: images?.map((img: { url: string }) => ({
            url: img.url,
          })) || [],
        },
  },
  include: {
    category: true,
    images: true, // include the actual Image data (id, url)
    productImages: {
      include: {
        productImage: true,
      },
    },
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

    await prisma.images.deleteMany({
      where: { productId: idNumber }
    });

    await prisma.orderItem.deleteMany({
      where: { productId: idNumber }
    });


    await prisma.productProductImage.deleteMany({
      where: { productId: idNumber }
    });

     await prisma.productVariant.deleteMany({
      where: { productId: idNumber }
    });


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