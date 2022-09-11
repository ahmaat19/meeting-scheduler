import mongoose from 'mongoose'

const categoryScheme = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: String,
  },
  { timestamps: true }
)

const Category =
  mongoose.models.Category || mongoose.model('Category', categoryScheme)
export default Category
