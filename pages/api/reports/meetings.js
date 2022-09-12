import moment from 'moment'
import nc from 'next-connect'
import db from '../../../config/db'
import Meeting from '../../../models/Meeting'

import { isAuth } from '../../../utils/auth'

const schemaName = Meeting

const handler = nc()
handler.use(isAuth)
handler.get(async (req, res) => {
  await db()
  try {
    const q = req.query && req.query.q

    const start = moment(q).clone().startOf('month').format()
    const end = moment(q).clone().endOf('month').format()

    let query = schemaName.find(
      q
        ? {
            createdAt: { $gte: start, $lt: end },
          }
        : {}
    )

    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 25
    const skip = (page - 1) * pageSize
    const total = await schemaName.countDocuments(
      q
        ? {
            createdAt: { $gte: start, $lt: end },
          }
        : {}
    )

    const pages = Math.ceil(total / pageSize)

    query = query
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .lean()
      .populate('category', ['name'])
      .populate('participants', ['name', 'title', 'email'])

    let result = await query

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

export default handler
