import mongoose from 'mongoose'
import Participant from './Participant'
import Category from './Category'

const meetingScheme = mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    location: {
      type: String,
      required: true,
      enum: ['physical', 'online'],
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Participant,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Category,
    },
    status: {
      type: String,
      enum: ['on schedule', 'not held', 'completed'],
      default: 'on schedule',
    },
  },
  { timestamps: true }
)

const Meeting =
  mongoose.models.Meeting || mongoose.model('Meeting', meetingScheme)
export default Meeting
