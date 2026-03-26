// /app/api/orders/status/route.ts
import dbConnect from '@/lib/db/connect'
import Order from '@/lib/models/Order'
import { NextRequest, NextResponse } from 'next/server'

// This endpoint is for an admin to update an order's status.
// In a real application, you would protect this endpoint
// to ensure only authenticated admins can access it.

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

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      )
    }

    const updateData: any = { status }

    if (status === 'shipped') {
      updateData.shippedAt = new Date()
      if (trackingNumber) {
        updateData.trackingNumber = trackingNumber
      }
    }
    
    if (status === 'delivered') {
      updateData.deliveredAt = new Date()
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
    console.error('Update order status error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
