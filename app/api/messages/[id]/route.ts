import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connect'
import ContactMessage from '@/lib/models/ContactMessage'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const message = await ContactMessage.findById(params.id)

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
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const body = await request.json()

    const message = await ContactMessage.findByIdAndUpdate(params.id, body, {
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
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const message = await ContactMessage.findByIdAndDelete(params.id)

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
