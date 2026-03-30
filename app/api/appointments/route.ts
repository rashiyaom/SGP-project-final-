import dbConnect from '@/lib/db/connect'
import Appointment from '@/lib/models/Appointment'
import { requireAuth } from '@/lib/middleware/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // ✅ SECURITY: Require authentication
    const auth = await requireAuth(req)
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      )
    }

    await dbConnect()

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const email = searchParams.get('email')

    // ✅ SECURITY: Users can only see their own appointments (unless admin)
    let query: any = {}
    if (auth.user?.role !== 'admin') {
      query.userId = auth.user?._id
    } else {
      // Admins can filter by any field
      if (userId) query.userId = userId
      if (email) query.userEmail = email
    }
    
    if (status) query.status = status

    const appointments = await Appointment.find(query).sort({ date: -1 })

    return NextResponse.json({
      success: true,
      data: appointments,
      count: appointments.length
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // ✅ SECURITY: Require authentication
    const auth = await requireAuth(req)
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      )
    }

    await dbConnect()
    const body = await req.json()

    // Validation
    if (!body.userId || !body.userEmail || !body.userName || !body.userPhone) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!body.type || !['online', 'offline'].includes(body.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid appointment type' },
        { status: 400 }
      )
    }

    if (!body.date || !body.time) {
      return Response.json(
        { success: false, message: 'Date and time are required' },
        { status: 400 }
      )
    }

    // Check for existing appointment on same date/time (within 30 min buffer)
    const dateObj = new Date(body.date)
    const existingAppointment = await Appointment.findOne({
      date: {
        $gte: new Date(dateObj.getTime() - 30 * 60000),
        $lte: new Date(dateObj.getTime() + 30 * 60000)
      },
      time: body.time,
      status: { $ne: 'cancelled' }
    })

    if (existingAppointment && !body.userId.includes(existingAppointment.userId)) {
      return Response.json(
        { success: false, message: 'This time slot is already booked' },
        { status: 409 }
      )
    }

    const appointment = new Appointment({
      ...body,
      status: 'pending'
    })

    await appointment.save()

    return Response.json(
      { success: true, data: appointment, message: 'Appointment created successfully' },
      { status: 201 }
    )
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // ✅ SECURITY: Require admin authentication
    const auth = await requireAuth(req)
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      )
    }

    if (auth.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    await dbConnect()
    const { searchParams } = new URL(req.url)
    const appointmentId = searchParams.get('id')
    const body = await req.json()

    if (!appointmentId) {
      return NextResponse.json(
        { success: false, message: 'Appointment ID required' },
        { status: 400 }
      )
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: appointment,
      message: 'Appointment updated successfully'
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // ✅ SECURITY: Require admin authentication
    const auth = await requireAuth(req)
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      )
    }

    if (auth.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    await dbConnect()
    const { searchParams } = new URL(req.url)
    const appointmentId = searchParams.get('id')

    if (!appointmentId) {
      return NextResponse.json(
        { success: false, message: 'Appointment ID required' },
        { status: 400 }
      )
    }

    await Appointment.findByIdAndDelete(appointmentId)

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully'
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
