import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { firstname, lastname, phone, email, profilePicture, homeAddress, password, isAdmin } = await request.json();
    console.log("Registration attempt for email:", email);
    
    if (!firstname || !lastname || !phone || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    if (!isAdmin) {
      console.log("Creating admin account");
      const admin = await prisma.admin.create({
        data: {
          username: email,
          email,
          password: hashedPassword,
        },
      });
      console.log("Admin created successfully:", admin.email);
      return NextResponse.json({ message: "Admin created successfully", admin });
    } else {
      console.log("Creating user account");
      const user = await prisma.users.create({
        data: {
          firstname,
          lastname,
          phone: parseInt(phone),
          email,
          password: hashedPassword,
          profilePicture: profilePicture || "https://ui-avatars.com/api/?name=" + encodeURIComponent(firstname + "+" + lastname),
          homeAddress
        },
      });
      console.log("User created successfully:", user.email);
      return NextResponse.json({ message: "User created successfully", user });
    }
  } catch (error: unknown) {
  console.error("Registration error:", error);
  
  // Type guard to check if error has a code property
  if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
    return NextResponse.json(
      { message: "Email already exists" },
      { status: 400 }
    );
  }
  
  return NextResponse.json(
    { message: "Internal server error" },
    { status: 500 }
  );
} finally {
  await prisma.$disconnect();
}
} 