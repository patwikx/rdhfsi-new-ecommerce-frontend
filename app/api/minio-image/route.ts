import { NextRequest, NextResponse } from 'next/server';
import { minioClient, DOCUMENTS_BUCKET } from '@/lib/minio';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fileName = searchParams.get('file');
    
    if (!fileName) {
      return new NextResponse('File parameter is required', { status: 400 });
    }

    // Generate a fresh presigned URL (valid for 1 hour)
    const url = await minioClient.presignedGetObject(DOCUMENTS_BUCKET, fileName, 60 * 60);
    
    // Redirect to the presigned URL
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return new NextResponse('Failed to load image', { status: 500 });
  }
}
