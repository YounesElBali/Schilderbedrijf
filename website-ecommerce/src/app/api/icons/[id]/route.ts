import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.icons.delete({
      where: { id: Number(id) },
    });

     return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ message: "Error deleting icon" }, { status: 500 });
  }
}
