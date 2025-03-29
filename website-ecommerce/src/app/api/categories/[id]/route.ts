import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: {params: Promise<{ id: string }> }  // This is the correct typing for dynamic parameters
) {
  try {
    // Make sure params.id is safely parsed as a number
    const categoryId = parseInt((await params).id, 10); // Adding the radix 10 for base 10

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { message: "Invalid category ID" },
        { status: 400 }
      );
    }

    // First, get the category to verify if it exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    // Delete the category (this will cascade delete related products)
    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ 
      message: "Category deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { message: "Error deleting category" },
      { status: 500 }
    );
  }
}
