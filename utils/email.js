import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const Email = async ({
  startDate,
  endDate,
  organization_name,
  topic,
  details,
  fromEmail,
  toEmail,
  fromName,
  location,
}) => {
  try {
    const mailOptions = {
      to: toEmail,
      from: {
        email: fromEmail,
        name: fromName,
      },
      templateId: 'YOUR-SENDGRID-DYNAMIC-TEMPLATE-ID',
      dynamic_template_data: {
        startDate,
        endDate,
        organization_name,
        topic,
        details,
        location,
      },
    }

    return await sgMail.send(mailOptions)
  } catch (error) {
    return { status: 400, error: error.message }
  }
}
