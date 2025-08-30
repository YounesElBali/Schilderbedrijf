// scripts/setup-minio.js
import { S3Client, CreateBucketCommand, PutBucketPolicyCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000',
  forcePathStyle: true,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin123',
  },
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'uploads';

async function setupMinio() {
  try {
    // Maak bucket aan
    console.log(`Creating bucket: ${BUCKET_NAME}`);
    await s3Client.send(new CreateBucketCommand({
      Bucket: BUCKET_NAME
    }));
    
    // Stel publieke read policy in
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
        }
      ]
    };

    console.log('Setting bucket policy...');
    await s3Client.send(new PutBucketPolicyCommand({
      Bucket: BUCKET_NAME,
      Policy: JSON.stringify(bucketPolicy)
    }));

    console.log(`✅ MinIO bucket '${BUCKET_NAME}' created and configured successfully!`);
  } catch (error) {
    if (error.name === 'BucketAlreadyOwnedByYou') {
      console.log(`✅ Bucket '${BUCKET_NAME}' already exists and is owned by you.`);
    } else {
      console.error('❌ Error setting up MinIO:', error);
    }
  }
}

setupMinio();