import mongoose, { Schema, Document } from 'mongoose'

export interface ICustomFilter extends Document {
  label: string
  category: 'Ceramic Tiles' | 'Marble' | 'Bathroom & Sanitary Ware' | 'Accessories' | 'all'
  filterGroup: string
  options: Array<{ id: string; label: string }>
  createdAt: Date
  updatedAt: Date
}

const CustomFilterSchema = new Schema<ICustomFilter>(
  {
    label: {
      type: String,
      required: [true, 'Please provide a filter label'],
      trim: true,
      maxlength: [100, 'Label cannot be more than 100 characters'],
    },
    category: {
      type: String,
      enum: ['Ceramic Tiles', 'Marble', 'Bathroom & Sanitary Ware', 'Accessories', 'all'],
      required: [true, 'Please provide a category'],
    },
    filterGroup: {
      type: String,
      required: [true, 'Please provide a filter group'],
      trim: true,
    },
    options: {
      type: [
        {
          id: {
            type: String,
            required: true,
          },
          label: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

// Create index for better query performance
CustomFilterSchema.index({ category: 1 })
CustomFilterSchema.index({ filterGroup: 1 })

export default mongoose.models.CustomFilter ||
  mongoose.model<ICustomFilter>('CustomFilter', CustomFilterSchema)
