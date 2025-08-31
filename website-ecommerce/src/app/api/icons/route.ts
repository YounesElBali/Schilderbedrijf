import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const icons = await prisma.icons.findMany();
    return NextResponse.json(icons);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ message: "Error fetching icons", error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, url } = await request.json();

    if (!name || !url) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const icon = await prisma.icons.create({
      data: { name, url },
    });

    return NextResponse.json(icon);
  } catch (error: unknown) {
    if (error === "P2002") {
      return NextResponse.json(
        { message: "Icon with this name or URL already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: "Error creating icon" }, { status: 500 });
  }
}
