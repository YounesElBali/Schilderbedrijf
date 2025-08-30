// app/api/upload/route.js - VERVANG je huidige versie met deze
import { NextResponse } from 'next/server';
import { uploadFileToMinio, deleteFileFromMinio, getFileNameFromUrl } from '@/lib/minio';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Genereer unieke filename met timestamp
    const fileExtension = file.name?.split('.').pop() || '';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    
    // Upload naar MinIO
    const url = await uploadFileToMinio(buffer, fileName, file.type);

    return NextResponse.json({ 
      success: true, 
      path: url, // Je frontend verwacht 'path' property
      url: url,
      fileName: fileName
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { path } = await request.json();
    
    if (!path) {
      return NextResponse.json({ error: 'No path provided' }, { status: 400 });
    }

    // Haal filename uit de URL
    const fileName = getFileNameFromUrl(path);
    
    if (fileName) {
      await deleteFileFromMinio(fileName);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed: ' + error.message }, { status: 500 });
  }
}