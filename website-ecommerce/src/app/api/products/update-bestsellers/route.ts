import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Get all products with their total quantity sold
    const productsWithSales = await prisma.$queryRaw`
      SELECT 
        p.id,
        COALESCE(SUM(oi.quantity), 0) as total_sold
      FROM Product p
      LEFT JOIN OrderItem oi ON p.id = oi.productId
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT 5
    `;

    // Delete all existing bestsellers
    await prisma.bestseller.deleteMany();

    // Create new bestsellers based on sales data
    const bestsellers = await Promise.all(
      (productsWithSales as any[]).map((product, index) =>
        prisma.bestseller.create({
          data: {
            productId: product.id,
            rank: index + 1
          }
        })
      )
    );

    return NextResponse.json({ message: 'Bestsellers updated successfully', bestsellers });
  } catch (error) {
    console.error('Error updating bestsellers:', error);
    return NextResponse.json(
      { error: 'Failed to update bestsellers' },
      { status: 500 }
    );
  }
} 