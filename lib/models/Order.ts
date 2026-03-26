import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true
    },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: { type: Number, default: 1 },
        image: String,
        category: String
      }
    ],
    shippingAddress: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'upi', 'net_banking'],
      default: 'credit_card'
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    notes: String,
    trackingNumber: String,
    shippedAt: Date,
    deliveredAt: Date
  },
  {
    timestamps: true
  }
)

// Create index on email and userId for faster lookups
OrderSchema.index({ email: 1 })
OrderSchema.index({ userId: 1 })
OrderSchema.index({ status: 1 })
OrderSchema.index({ createdAt: -1 })

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)
