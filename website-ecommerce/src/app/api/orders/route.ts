import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, items, totalPrice, shippingAddress, billingAddress, paymentMethod, email } = body;

    // Validate required fields
    if (!items || !totalPrice || !shippingAddress || !billingAddress || !paymentMethod || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: userId ? parseInt(userId) : null,
        email,
        totalPrice: parseFloat(totalPrice),
        status: 'PENDING',
        shippingAddress: shippingAddress.toString(),
        billingAddress: billingAddress.toString(),
        paymentMethod,
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
} 