import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"; // Ensure this path is correct
const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ message: "Error fetching categories", error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, image, path } = await request.json();

    if (!name || !image || !path) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        image,
        path,
      },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Category name or path already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Error creating category" },
      { status: 500 }
    );
  }
}
