import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      items, 
      totalPrice, 
      shippingAddress, 
      billingAddress,
      paymentMethod 
    } = await request.json();

    // Validate required fields
    if (!userId || !items || !totalPrice || !shippingAddress) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the order with its items
    const order = await prisma.order.create({
      data: {
        userId: parseInt(userId),
        totalPrice: parseFloat(totalPrice),
        status: "PENDING",
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: billingAddress ? JSON.stringify(billingAddress) : null,
        paymentMethod,
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Error creating order" },
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
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Error fetching orders" },
      { status: 500 }
    );
  }
} 