import { NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

const IMAGES_DIR = "/var/www/images";

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

    const uniqueId = uuidv4();
    const extension = file.name.split(".").pop();
    const filename = `${uniqueId}.${extension}`;
    const filepath = join(IMAGES_DIR, filename);

    // Save the file to /var/www/images
    await writeFile(filepath, buffer);

    // Return the filename or the path (adjust to your needs)
    return NextResponse.json({ 
      path: `/images/${filename}`,  // This assumes your web server serves /var/www/images as /images
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

    const relativePath = path.startsWith("/") ? path.slice(1) : path;
    const filepath = join("/var/www", relativePath); // Since path is like /images/filename.jpg

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
