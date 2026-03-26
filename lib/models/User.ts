import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      minlength: 2,
      maxlength: 100
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false // Don't include in queries by default
    },
    profile: {
      phone: String,
      address: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      bio: String,
      preferences: {
        emailNotifications: { type: Boolean, default: true },
        smsNotifications: { type: Boolean, default: false },
        theme: { type: String, enum: ['light', 'dark'], default: 'light' }
      }
    },
    cart: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        category: String
      }
    ],
    dreams: [
      {
        id: String,
        title: String,
        images: [String],
        description: String,
        inspirations: [String],
        createdAt: Date
      }
    ],
    wishlist: [String], // Array of product IDs
    isAdmin: {
      type: Boolean,
      default: false
    },
    adminData: {
      products: [mongoose.Schema.Types.Mixed],
      gallery: [mongoose.Schema.Types.Mixed],
      filters: [mongoose.Schema.Types.Mixed],
      contactMessages: [mongoose.Schema.Types.Mixed]
    },
    session: {
      isActive: { type: Boolean, default: false },
      lastActivity: { type: Date, default: null },
      loginTime: { type: Date, default: null },
      redirectAfterLogin: { type: String, default: null }
    }
  },
  {
    timestamps: true
  }
)

// Create index on email for faster lookups
UserSchema.index({ email: 1 })

export default mongoose.models.User || mongoose.model('User', UserSchema)
