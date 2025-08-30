import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        user: { select: { firstname: true, lastname: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const data = comments.map(c => ({
      id: c.id,
      rating: c.rating,
      title: c.title,
      content: c.content,
      createdAt: c.createdAt.toISOString(),
      user: {
        firstname: c.user.firstname,
        lastname: c.user.lastname,
      },
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Error fetching comments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = await prisma.comment.create({
      data: {
        rating: body.rating,
        title: body.title,
        content: body.content,
        user: { connect: { id: body.userId } },
      },
      include: { user: { select: { firstname: true, lastname: true } } },
    });

    const data = {
      id: created.id,
      rating: created.rating,
      title: created.title,
      content: created.content,
      createdAt: created.createdAt.toISOString(),
      user: {
        firstname: created.user.firstname,
        lastname: created.user.lastname,
      },
    };

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Error creating comment" }, { status: 500 });
  }
}