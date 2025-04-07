import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Params = { params: { id: string } };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { status } = await request.json();
    const orderId = parseInt(params.id);

    if (!status) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating order status" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request, { params }: Params) {
  try {
    const orderId = parseInt(params.id);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        totalPrice: true,
        createdAt: true,
        orderItems: {
          select: {
            quantity: true,
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
