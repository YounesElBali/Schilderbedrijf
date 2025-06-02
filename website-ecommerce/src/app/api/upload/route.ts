import { NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { cwd } from "process";

export const config = {
  api: {
    bodyParser: false,  // important! disable Next.js body parsing for this route
  },
};

const IMAGES_DIR = join(cwd(), "public", "images");

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
import prisma from '@/lib/prisma'; // your Prisma client import

export async function DELETE(request: Request) {
  try {
    const { path } = await request.json();

    if (!path || path === "/images/" || path === "/images") {
      return NextResponse.json(
        { message: "Invalid or missing file path" },
        { status: 400 }
      );
    }

    const filename = path.replace(/^\/?images\//, "").trim();
    if (!filename) {
      return NextResponse.json(
        { message: "No valid filename found" },
        { status: 400 }
      );
    }

    const filepath = join(IMAGES_DIR, filename);
    console.log("Deleting file:", filepath); // Debug

    // 1. Delete the file from disk
    await unlink(filepath);

    // 2. Delete the image record in DB by matching url (assuming url is stored as `/images/filename.jpg`)
    const deletedImage = await prisma.images.deleteMany({
      where: {
        url: `/images/${filename}`,
      },
    });

    console.log("Deleted image record count:", deletedImage.count);

    return NextResponse.json({
      message: "File and DB record deleted successfully",
      deletedImageCount: deletedImage.count,
    });
  } catch (error) {
    console.error("Error deleting file and DB record:", error);
    return NextResponse.json(
      {
        message: "Error deleting file",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}

