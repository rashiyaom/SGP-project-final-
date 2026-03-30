import mongoose from 'mongoose'

const AppointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true
    },
    userEmail: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      index: true
    },
    userName: {
      type: String,
      required: [true, 'Name is required']
    },
    userPhone: {
      type: String,
      required: [true, 'Phone number is required']
    },
    type: {
      type: String,
      enum: ['online', 'offline'],
      required: [true, 'Appointment type is required']
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time in HH:MM format']
    },
    // For online meetings
    meetingLink: {
      type: String,
      default: null
    },
    // For offline visits
    location: {
      type: String,
      default: null
    },
    address: {
      type: String,
      default: null
    },
    city: {
      type: String,
      default: null
    },
    pincode: {
      type: String,
      default: null
    },
    // Meeting details
    purpose: {
      type: String,
      default: null,
      maxlength: 500
    },
    notes: {
      type: String,
      default: null,
      maxlength: 500
    },
    // Status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'rescheduled', 'completed', 'cancelled'],
      default: 'pending',
      index: true
    },
    // Admin notes
    adminNotes: {
      type: String,
      default: null
    },
    // Rescheduling info
    rescheduleReason: {
      type: String,
      default: null
    },
    originalDate: {
      type: Date,
      default: null
    },
    originalTime: {
      type: String,
      default: null
    },
    // Notification tracking
    whatsappSent: {
      type: Boolean,
      default: false
    },
    whatsappMessage: {
      type: String,
      default: null
    },
    emailSent: {
      type: Boolean,
      default: false
    },
    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

// Add indexes for queries
AppointmentSchema.index({ userId: 1, createdAt: -1 })
AppointmentSchema.index({ status: 1, date: 1 })
AppointmentSchema.index({ date: 1, time: 1 })

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema)
