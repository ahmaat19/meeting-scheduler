import nc from 'next-connect'
import db from '../../../config/db'
import Participant from '../../../models/Participant'
import Meeting from '../../../models/Meeting'
import { isAuth } from '../../../utils/auth'
import moment from 'moment'

const schemaName = Meeting

const handler = nc()
handler.use(isAuth)
handler.get(async (req, res) => {
  await db()
  try {
    const q = req.query && req.query.q

    let query = schemaName.find(
      q ? { title: { $regex: q, $options: 'i' } } : {}
    )

    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 25
    const skip = (page - 1) * pageSize
    const total = await schemaName.countDocuments(
      q ? { title: { $regex: q, $options: 'i' } } : {}
    )

    const pages = Math.ceil(total / pageSize)

    query = query
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .lean()
      .populate('category', ['name'])
      .populate('participants')

    const result = await query

    res.status(200).json({
      startIndex: skip + 1,
      endIndex: skip + result.length,
      count: result.length,
      page,
      pages,
      total,
      data: result,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

handler.post(async (req, res) => {
  await db()
  try {
    if (req?.body?.start > req?.body?.end)
      return res
        .status(400)
        .json({ error: 'The start date is not later than the end date.' })

    req.body?.participants?.forEach(async (p) => {
      const participant = await Participant.findOne({
        _id: p,
        status: 'active',
      })
      if (!participant)
        return res.status(404).json({ error: 'Participant not found' })
    })

    const object = await schemaName.create({
      ...req.body,
      createdBy: req.user.id,
    })
    res.status(200).send(object)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
