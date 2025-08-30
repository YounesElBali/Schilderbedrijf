// app/api/products/[id]/route.js
import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { deleteFileFromMinio, getFileNameFromUrl } from '@/lib/minio';

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
        images: true,
        productImages: {
          include: {
            productImage: true,
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
    const { name, description, price, images, categoryId, isNew, inStock, articlenr, traits, iconIds } = body;

    // Haal bestaande images op voordat we ze verwijderen
    const existingImages = await prisma.images.findMany({
      where: { productId: idNumber },
      select: { url: true },
    });

    const existingUrls = new Set(existingImages.map(img => img.url));
    const newUrls = new Set((images || []).map((img: { url: string }) => img.url));

    // Vind images die verwijderd moeten worden (bestaan in DB maar niet in nieuwe lijst)
    const imagesToDelete = existingImages.filter(img => !newUrls.has(img.url));

    // Verwijder oude bestanden uit MinIO (parallel uitvoeren voor betere performance)
    const deletePromises = imagesToDelete.map(async (img) => {
      try {
        const fileName = getFileNameFromUrl(img.url);
        if (fileName) {
          await deleteFileFromMinio(fileName);
          console.log(`Deleted file from MinIO: ${fileName}`);
        }
      } catch (error) {
        console.error(`Failed to delete file from MinIO: ${img.url}`, error);
        // Continue met andere deletes zelfs als één faalt
      }
    });

    // Wacht tot alle MinIO deletes klaar zijn (of falen)
    await Promise.allSettled(deletePromises);

    // Database transactie voor atomaire updates
    const product = await prisma.$transaction(async (tx) => {
      // 1. Verwijder bestaande icon relaties
      await tx.productProductImage.deleteMany({
        where: { productId: idNumber }
      });

      // 2. Verwijder alle bestaande images uit database
      await tx.images.deleteMany({
        where: { productId: idNumber }
      });

      // 3. Voeg nieuwe icon relaties toe
      if (iconIds && iconIds.length > 0) {
        await tx.productProductImage.createMany({
          data: iconIds.map((iconId: number) => ({
            productId: idNumber,
            productImageId: iconId,
          })),
        });
      }

      // 4. Update product en voeg nieuwe images toe
      return await tx.product.update({
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
            create: (images || []).map((img: { url: string }) => ({
              url: img.url,
            })),
          },
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

    // Haal product en alle gerelateerde images op voordat we verwijderen
    const product = await prisma.product.findUnique({
      where: { id: idNumber },
      include: {
        images: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Verwijder alle bestanden uit MinIO parallel
    const deleteFilePromises = product.images.map(async (image) => {
      try {
        const fileName = getFileNameFromUrl(image.url);
        if (fileName) {
          await deleteFileFromMinio(fileName);
          console.log(`Deleted file from MinIO: ${fileName}`);
        }
      } catch (error) {
        console.error(`Failed to delete file from MinIO: ${image.url}`, error);
        // Continue met andere deletes
      }
    });

    // Wacht tot alle bestanden verwijderd zijn (of probeer het tenminste)
    await Promise.allSettled(deleteFilePromises);

    // Verwijder alles uit database in één transactie
    await prisma.$transaction(async (tx) => {
      // Verwijder in juiste volgorde vanwege foreign key constraints
      await tx.images.deleteMany({
        where: { productId: idNumber }
      });

      await tx.orderItem.deleteMany({
        where: { productId: idNumber }
      });

      await tx.productProductImage.deleteMany({
        where: { productId: idNumber }
      });

      await tx.productVariant.deleteMany({
        where: { productId: idNumber }
      });

      await tx.product.delete({
        where: { id: idNumber },
      });
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