import nc from 'next-connect'
import db from '../../../config/db'
import Meeting from '../../../models/Meeting'
import Participant from '../../../models/Participant'
import { isAuth } from '../../../utils/auth'

const schemaName = Participant
const schemaNameString = 'Participant'

const handler = nc()
handler.use(isAuth)
handler.put(async (req, res) => {
  await db()
  try {
    const { id } = req.query
    const { name, title, email, mobile, gender, status } = req.body

    const object = await schemaName.findById(id)
    if (!object)
      return res.status(400).json({ error: `${schemaNameString} not found` })

    const exist = await schemaName.findOne({
      email: { $regex: `^${req.body?.email?.trim()}$`, $options: 'i' },
      _id: { $ne: id },
    })

    if (exist)
      return res.status(400).json({ error: 'Duplicate value detected' })

    object.name = name
    object.title = title
    object.email = email
    object.mobile = mobile
    object.gender = gender
    object.status = status
    object.updatedBy = req.user.id
    await object.save()
    res.status(200).json({ message: `${schemaNameString} updated` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

handler.delete(async (req, res) => {
  await db()
  try {
    const { id } = req.query

    const object = await schemaName.findById(id)
    if (!object)
      return res.status(400).json({ error: `${schemaNameString} not found` })

    object?.participants?.map(async (p) => {
      const meeting = await Meeting.findOne({ participants: { $in: p } })
      if (meeting)
        return res.status(400).json({
          error:
            'A previously used category in the meetings database cannot be deleted.',
        })
    })

    await object.remove()
    res.status(200).json({ message: `${schemaNameString} removed` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
