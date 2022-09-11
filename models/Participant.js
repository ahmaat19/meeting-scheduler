import mongoose from 'mongoose'

const participantScheme = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true },
    gender: { type: String, required: true, enum: ['male', 'female'] },
    mobile: { type: Number, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    status: { type: String, enum: ['active', 'disabled'], default: 'active' },
  },
  { timestamps: true }
)

const Participant =
  mongoose.models.Participant ||
  mongoose.model('Participant', participantScheme)
export default Participant
