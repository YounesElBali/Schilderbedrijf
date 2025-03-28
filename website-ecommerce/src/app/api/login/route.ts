import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log("Login attempt for email:", email);

    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Try to find admin first
    const admin = await prisma.admin.findFirst({
      where: {
        OR: [
          { email },
          { username: email }
        ]
      }
    });

    if (admin) {
      console.log("Found admin:", admin.email);
      const passwordMatch = await bcrypt.compare(password, admin.password);
      if (passwordMatch) {
        return NextResponse.json({ 
          message: "Login successful",
          user: {
            id: admin.id,
            email: admin.email,
            username: admin.username,
            isAdmin: true
          }
        });
      }
    }

    // If not admin, try to find user
    const user = await prisma.users.findFirst({
      where: { email }
    });

    if (user) {
      console.log("Found user:", user.email);
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        return NextResponse.json({
          message: "Login successful",
          user: {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            isAdmin: false
          }
        });
      }
    }

    console.log("No matching user found or invalid password");
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}