import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { oldPublicId, newPublicId } = body;

    if (!oldPublicId || !newPublicId) {
      return NextResponse.json(
        { error: 'oldPublicId and newPublicId are required' },
        { status: 400 }
      );
    }

    // Rename the image in Cloudinary
    const result = await cloudinary.uploader.rename(oldPublicId, newPublicId);

    return NextResponse.json({
      success: true,
      public_id: result.public_id,
      secure_url: result.secure_url,
    });
  } catch (error: any) {
    console.error('Error renaming image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to rename image' },
      { status: 500 }
    );
  }
}
