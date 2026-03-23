import mongoose, { Schema, Document } from 'mongoose'

export interface IGalleryItem extends Document {
  title: string
  category: string
  image: string
  description: string
  featured: boolean
  style?: string
  tileSize?: string
  createdAt: Date
  updatedAt: Date
}

const GalleryItemSchema = new Schema<IGalleryItem>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a gallery item title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    style: {
      type: String,
      trim: true,
    },
    tileSize: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Create index for better query performance
GalleryItemSchema.index({ category: 1 })
GalleryItemSchema.index({ featured: 1 })

const GalleryItem = mongoose.models.GalleryItem || mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema)

export default GalleryItem
