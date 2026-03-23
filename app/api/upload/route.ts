import { NextRequest, NextResponse } from 'next/server'
import { uploadImageFromUrl, uploadImageFromBase64, deleteImage } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.url && !body.base64) {
      return NextResponse.json(
        { success: false, error: 'Either url or base64 is required' },
        { status: 400 }
      )
    }

    let result

    if (body.url) {
      result = await uploadImageFromUrl(body.url, body.folder || 'omkar-ceramics')
    } else {
      result = await uploadImageFromBase64(body.base64, body.folder || 'omkar-ceramics')
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to upload image'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.publicId) {
      return NextResponse.json(
        { success: false, error: 'publicId is required' },
        { status: 400 }
      )
    }

    await deleteImage(body.publicId)

    return NextResponse.json({ success: true, data: { deleted: true } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete image'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
