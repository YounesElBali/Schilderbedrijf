// app/api/products/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteFileFromMinio, getFileNameFromUrl } from '@/lib/minio';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        variants: true,
        images: true,
        productImages: { include: { productImage: true } },
      },
      orderBy: { id: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: any = null; // Declare outside try block
  
  try {
    body = await request.json();
    const {
      name,
      description,
      price,
      images,
      categoryId,
      isNew,
      inStock,
      articlenr,
      traits,
      deliveryCost,
      iconIds = [],
    } = body ?? {};


    // Basic validation
    if (!name || price == null || !categoryId || !articlenr) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ message: "Provide at least one image" }, { status: 400 });
    }

    // Coerce numbers robustly
    const priceNum = typeof price === "string" ? parseFloat(price) : Number(price);
    const categoryIdNum = typeof categoryId === "string" ? parseInt(categoryId, 10) : Number(categoryId);
    const deliveryCostNum =
      deliveryCost == null ? 6.95 :
      typeof deliveryCost === "string" ? parseFloat(deliveryCost) : Number(deliveryCost);

    if (!Number.isFinite(priceNum) || !Number.isFinite(categoryIdNum) || !Number.isFinite(deliveryCostNum)) {
      return NextResponse.json({ message: "Invalid numeric fields" }, { status: 400 });
    }

    // Create product + images + optional icon joins
    const created = await prisma.$transaction(async (tx : any) => {
      const product = await tx.product.create({
        data: {
          name,
          description: description ?? null,
          price: priceNum,
          categoryId: categoryIdNum,
          isNew: Boolean(isNew),
          inStock: Boolean(inStock),
          articlenr,
          traits: traits ?? null,
          deliveryCost: deliveryCostNum,
          images: { create: images.map((img: { url: string }) => ({ url: img.url })) },
        },
      });

      if (Array.isArray(iconIds) && iconIds.length > 0) {
        await tx.productProductImage.createMany({
          data: iconIds.map((iconId: number) => ({
            productId: product.id,
            productImageId: iconId,
          })),
          skipDuplicates: true,
        });
      }

      return product.id;
    });

    const full = await prisma.product.findUnique({
      where: { id: created },
      include: {
        category: true,
        variants: true,
        images: true,
        productImages: { include: { productImage: true } },
      },
    });

    return NextResponse.json(full);
  }  catch (error) {
    console.error("Error creating product:", error);
    
    // Now body is accessible here
    if (body?.images) {
      const cleanupPromises = body.images.map(async (img: { url: string }) => {
        try {
          const fileName = getFileNameFromUrl(img.url);
          if (fileName) {
            await deleteFileFromMinio(fileName);
            console.log(`Cleaned up uploaded file after error: ${fileName}`);
          }
        } catch (cleanupError) {
          console.error(`Failed to cleanup file: ${img.url}`, cleanupError);
        }
      });
      
      await Promise.allSettled(cleanupPromises);
    }
    
    return NextResponse.json({ message: "Error creating product" }, { status: 500 });
  }
}

// Handige utility functie voor het opruimen van zwevende bestanden
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cleanup = searchParams.get('cleanup');
    
    if (cleanup === 'orphaned') {
      // Deze functie kan gebruikt worden om zwevende bestanden op te ruimen
      // die in MinIO staan maar niet meer in de database voorkomen
      return await cleanupOrphanedFiles();
    }
    
    return NextResponse.json({ message: "Invalid cleanup operation" }, { status: 400 });
  } catch (error) {
    console.error("Error in cleanup operation:", error);
    return NextResponse.json({ message: "Cleanup failed" }, { status: 500 });
  }
}

// Functie om zwevende bestanden op te ruimen (optioneel)
async function cleanupOrphanedFiles() {
  // Deze functie zou alle bestanden in MinIO kunnen vergelijken met wat er in de database staat
  // en zwevende bestanden verwijderen. Dit is een geavanceerde operatie.
  return NextResponse.json({ 
    message: "Orphaned file cleanup not yet implemented" 
  });
}