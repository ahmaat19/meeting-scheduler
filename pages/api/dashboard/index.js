import nc from 'next-connect'
import db from '../../../config/db'
import Meeting from '../../../models/Meeting'
import { isAuth } from '../../../utils/auth'

const handler = nc()
handler.use(isAuth)
handler.get(async (req, res) => {
  await db()
  try {
    const previousMeetings = await Meeting.find({ start: { $lte: new Date() } })
      .sort({ createdAt: -1 })
      .lean()
      .populate('category', ['name'])
      .populate('participants')
      .limit(3)

    const upcomingMeetings = await Meeting.find({ start: { $gte: new Date() } })
      .sort({ createdAt: -1 })
      .lean()
      .populate('category', ['name'])
      .populate('participants')
      .limit(3)

    const totalPreviousMeetings = await Meeting.countDocuments({
      start: { $lte: new Date() },
    })
    const totalUpcomingMeetings = await Meeting.countDocuments({
      start: { $gte: new Date() },
    })

    const meetingParticipants = await Meeting.find({}, { participants: 1 })
      .lean()
      .populate('participants', ['name', 'email', 'title'])

    let result = []
    meetingParticipants?.forEach((obj) => {
      obj?.participants?.map((participant) => result.push(participant))
    })

    const noOfParticipantsParticipated = result.reduce((a, b) => {
      var i = a.findIndex((x) => x._id === b._id)
      return i === -1 ? a.push({ _id: b._id, ...b, times: 1 }) : a[i].times++, a
    }, [])

    const meetingCategories = await Meeting.find({}, { category: 1 })
      .lean()
      .populate('category', ['name'])

    const noOfCategoriesInMeeting = meetingCategories
      ?.map((obj) => obj?.category)
      .reduce((a, b) => {
        var i = a.findIndex((x) => x._id === b._id)
        return (
          i === -1 ? a.push({ _id: b._id, ...b, times: 1 }) : a[i].times++, a
        )
      }, [])

    res.status(200).json({
      previousMeetings,
      upcomingMeetings,
      totalPreviousMeetings,
      totalUpcomingMeetings,
      noOfParticipantsParticipated,
      noOfCategoriesInMeeting,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
