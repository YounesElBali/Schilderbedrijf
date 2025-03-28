import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        user: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { message: "Error fetching comments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { rating, title, content, userId } = await request.json();

    if (!rating || !title || !content || !userId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        rating,
        title,
        content,
        userId: parseInt(userId),
      },
      include: {
        user: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { message: "Error creating comment" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 