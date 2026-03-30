import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connect'
import GalleryItem from '@/lib/models/GalleryItem'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await dbConnect()

    const item = await GalleryItem.findById(id)

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Gallery item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: item })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch gallery item'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await dbConnect()

    const body = await request.json()

    const item = await GalleryItem.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Gallery item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: item })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update gallery item'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await dbConnect()

    const item = await GalleryItem.findByIdAndDelete(id)

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Gallery item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: item })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete gallery item'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
