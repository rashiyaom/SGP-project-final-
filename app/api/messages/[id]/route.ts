import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connect'
import ContactMessage from '@/lib/models/ContactMessage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await dbConnect()

    const message = await ContactMessage.findById(id)

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: message })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch message'
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

    const message = await ContactMessage.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: message })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update message'
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

    const message = await ContactMessage.findByIdAndDelete(id)

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: message })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete message'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
