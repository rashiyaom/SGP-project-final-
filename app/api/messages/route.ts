import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connect'
import ContactMessage from '@/lib/models/ContactMessage'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const read = searchParams.get('read')
    const skip = parseInt(searchParams.get('skip') || '0')
    const limit = parseInt(searchParams.get('limit') || '20')

    let query: any = {}
    if (read === 'true') query.read = true
    if (read === 'false') query.read = false

    const messages = await ContactMessage.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await ContactMessage.countDocuments(query)

    return NextResponse.json({
      success: true,
      data: messages,
      total,
      page: Math.floor(skip / limit) + 1,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch messages'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const msg = await ContactMessage.create({
      ...body,
      read: false,
    })

    return NextResponse.json(
      { success: true, data: msg },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create message'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
