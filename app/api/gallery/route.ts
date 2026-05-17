import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connect'
import GalleryItem from '@/lib/models/GalleryItem'
import { requireAdmin } from '@/lib/middleware/auth'

const MAX_PAGE_SIZE = 100

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const skip = parseInt(searchParams.get('skip') || '0')
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20'), 1), MAX_PAGE_SIZE)

    let query: any = {}
    if (category) query.category = category
    if (featured === 'true') query.featured = true

    const items = await GalleryItem.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ featured: -1, createdAt: -1 })

    const total = await GalleryItem.countDocuments(query)

    return NextResponse.json({
      success: true,
      data: items,
      total,
      page: Math.floor(skip / limit) + 1,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch gallery items'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status })
    }

    await dbConnect()

    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.category || !body.image || !body.description) {
      return NextResponse.json(
        { success: false, error: 'Title, category, image, and description are required' },
        { status: 400 }
      )
    }

    const item = await GalleryItem.create(body)

    return NextResponse.json(
      { success: true, data: item },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create gallery item'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
