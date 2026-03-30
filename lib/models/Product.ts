import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  price?: number
  pricingType: 'fixed' | 'inquire'
  originalPrice?: number
  category: 'Ceramic Tiles' | 'Marble' | 'Bathroom & Sanitary Ware' | 'Accessories'
  rating: number
  inStock: boolean
  images: string[]
  image: string
  description?: string
  filters?: Record<string, string[]>
  sku?: string
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    price: {
      type: Number,
      min: [0, 'Price must be at least 0'],
    },
    pricingType: {
      type: String,
      enum: ['fixed', 'inquire'],
      default: 'fixed',
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price must be at least 0'],
    },
    category: {
      type: String,
      enum: ['Ceramic Tiles', 'Marble', 'Bathroom & Sanitary Ware', 'Accessories'],
      required: [true, 'Please provide a category'],
    },
    rating: {
      type: Number,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    images: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    filters: {
      type: Schema.Types.Mixed,
      default: {},
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

// Ensure we set image to first image in images array if not set
ProductSchema.pre('save', function (next) {
  if (this.images && this.images.length > 0 && !this.image) {
    this.image = this.images[0]
  }
  next()
})

// Add indexes for performance
ProductSchema.index({ category: 1 })
ProductSchema.index({ createdAt: -1 })
ProductSchema.index({ name: 'text' })
ProductSchema.index({ inStock: 1 })

export default mongoose.models.Product ||
  mongoose.model<IProduct>('Product', ProductSchema)
