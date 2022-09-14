import nc from 'next-connect'
import db from '../../../config/db'
// import Meeting from '../../../models/Meeting'
import { isAuth } from '../../../utils/auth'
import { Email } from '../../../utils/email'
import { sendEmail } from '../../../utils/nodemailer'
import { eTemplate } from '../../../utils/eTemplate'
import moment from 'moment'

// const schemaName = Meeting

const handler = nc()
handler.use(isAuth)
handler.post(async (req, res) => {
  await db()
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ error: 'Data you want to send is required' })

    const result = Promise.all(
      req.body?.participants?.map(async (participant) => {
        const message = eTemplate({
          startDate: moment(req.body?.start).format('YYYY-MM-DD HH:mm'),
          endDate: moment(req.body?.end).format('YYYY-MM-DD HH:mm'),
          organization: "Ahmed's Organization",
          topic: req.body?.title,
          details: req.body?.description,
          location: req.body?.location,
          fromEmail: participant?.email,
          fromName: req?.user?.name,
          toEmail: participant?.email,
        })

        const result = sendEmail({
          to: participant?.email,
          subject: 'Meeting Invitation',
          text: message,
          organization: "Ahmed's Organization",
        })

        if (await result)
          return res.status(200).json({
            message: `An email has been sent to ${participant?.email} with further instructions.`,
          })
      })
    )

    await result

    res.status(200).send('success')
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
