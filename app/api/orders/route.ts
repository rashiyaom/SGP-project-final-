import dbConnect from '@/lib/db/connect'
import Order from '@/lib/models/Order'
import { NextRequest, NextResponse } from 'next/server'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { z } from 'zod'

// Zod schema for creating an order
const orderSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  userId: z.string().optional(),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().min(1),
    image: z.string().url(),
  })).min(1, { message: "Order must contain at least one item" }),
  shippingAddress: z.object({
    address: z.string().min(1, { message: "Address is required" }),
    city: z.string().min(1, { message: "City is required" }),
    state: z.string().min(1, { message: "State is required" }),
    zipCode: z.string().min(1, { message: "Zip code is required" }),
  }),
  paymentMethod: z.string().min(1, { message: "Payment method is required" }),
  totalAmount: z.number().positive({ message: "Total amount must be positive" }),
});

// Zod schema for updating an order
const updateOrderSchema = z.object({
  orderId: z.string().min(1, { message: "Order ID is required" }),
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
});


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

    // Validate request body
    const validation = orderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, userId, items, shippingAddress, paymentMethod, totalAmount } = validation.data;

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

    // Send confirmation email - fire and forget
    sendOrderConfirmationEmail(order.toObject());

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

    // Validate request body
    const validation = updateOrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { orderId, status, trackingNumber, notes } = validation.data;

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
