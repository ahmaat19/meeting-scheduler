import nc from 'next-connect'
import db from '../../../config/db'
import Participant from '../../../models/Participant'
import Meeting from '../../../models/Meeting'
import { isAuth } from '../../../utils/auth'
import moment from 'moment'

const schemaName = Meeting
const schemaNameString = 'Meeting'

const handler = nc()
handler.use(isAuth)

handler.get(async (req, res) => {
  await db()
  try {
    const { id } = req.query
    const object = await schemaName
      .findById(id)
      .populate('category')
      .populate('participants')

    if (!object)
      return res.status(400).json({ error: `${schemaNameString} not found` })

    res.send(object)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

handler.put(async (req, res) => {
  await db()
  try {
    const { id } = req.query
    const {
      title,
      description,
      start,
      end,
      participants,
      category,
      status,
      location,
    } = req.body

    if (moment(start).format() > moment(end).format())
      return res
        .status(400)
        .json({ error: 'The start date is not later than the end date.' })

    const object = await schemaName.findById(id)
    if (!object)
      return res.status(400).json({ error: `${schemaNameString} not found` })

    participants?.forEach(async (p) => {
      const participant = await Participant.findOne({
        _id: p,
        status: 'active',
      })
      if (!participant)
        return res.status(404).json({ error: 'Participant not found' })
    })

    object.title = title
    object.description = description
    object.start = start
    object.end = end
    object.participants = participants
    object.category = category
    object.location = location
    object.status = status
    // object.updatedBy = req.user.id
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

    await object.remove()
    res.status(200).json({ message: `${schemaNameString} removed` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
