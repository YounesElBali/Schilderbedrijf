// lib/minio.js
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT,
  forcePathStyle: true, // Belangrijk voor MinIO
  region: 'us-east-1', // MinIO vereist dit, maar gebruikt het niet echt
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME;

// Upload bestand naar MinIO
export async function uploadFileToMinio(fileBuffer, fileName, contentType) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
    // Maak bestanden publiek leesbaar
    ACL: 'public-read'
  });

  try {
    await s3Client.send(command);
    // Return de publieke URL
    return `${process.env.MINIO_ENDPOINT}/${BUCKET_NAME}/${fileName}`;
  } catch (error) {
    console.error('MinIO upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
}

// Verwijder bestand van MinIO
export async function deleteFileFromMinio(fileName) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
  });

  try {
    await s3Client.send(command);
    return { success: true };
  } catch (error) {
    console.error('MinIO delete error:', error);
    throw new Error(`Delete failed: ${error.message}`);
  }
}

// Functie om filename uit URL te halen
export function getFileNameFromUrl(url) {
  if (!url) return null;
  const parts = url.split('/');
  return parts[parts.length - 1];
}