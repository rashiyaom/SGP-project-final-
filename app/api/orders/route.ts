import dbConnect from '@/lib/db/connect'
import Order from '@/lib/models/Order'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    let query: any = {}

    if (email) {
      query.email = email
    }

    if (userId) {
      query.userId = userId
    }

    if (status) {
      query.status = status
    }

    const orders = await Order.find(query).sort({ createdAt: -1 })

    return NextResponse.json({ success: true, data: orders }, { status: 200 })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const body = await req.json()
    const { email, userId, items, shippingAddress, paymentMethod, totalAmount } = body

    if (!email || !items || !shippingAddress || totalAmount === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new order
    const order = await Order.create({
      email,
      userId: userId || 'guest',
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status: 'pending'
    })

    return NextResponse.json({ success: true, data: order }, { status: 201 })
  } catch (error: any) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect()

    const body = await req.json()
    const { orderId, status, trackingNumber, notes } = body

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}

    if (status) {
      updateData.status = status
      if (status === 'shipped' && !updateData.shippedAt) {
        updateData.shippedAt = new Date()
      }
      if (status === 'delivered') {
        updateData.deliveredAt = new Date()
      }
    }

    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber
    }

    if (notes) {
      updateData.notes = notes
    }

    const order = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: order }, { status: 200 })
  } catch (error) {
    console.error('Update order error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
