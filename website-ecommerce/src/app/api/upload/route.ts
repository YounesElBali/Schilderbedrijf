import { NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueId = uuidv4();
    const extension = file.name.split(".").pop();
    const filename = `${uniqueId}.${extension}`;

    // Ensure the images directory exists
    const imagesDir = join(process.cwd(), "public", "images");
    const filepath = join(imagesDir, filename);

    // Save the file
    await writeFile(filepath, buffer);

    // Return the relative path
    return NextResponse.json({ 
      path: `/images/${filename}`,
      message: "File uploaded successfully" 
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { message: "Error uploading file" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { path } = await request.json();

    if (!path) {
      return NextResponse.json(
        { message: "No file path provided" },
        { status: 400 }
      );
    }

    // Remove the leading slash to get the relative path
    const relativePath = path.startsWith("/") ? path.slice(1) : path;
    const filepath = join(process.cwd(), "public", relativePath);

    // Delete the file
    await unlink(filepath);

    return NextResponse.json({ 
      message: "File deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { message: "Error deleting file" },
      { status: 500 }
    );
  }
} 