import newrelic from 'newrelic'
import config from '../config'
import mail from '../config/mailer'

export interface Payload {
  to: string
  subject: string
  text?: string
  html?: string
}

export const sendMail = async (payload: Payload) => {
  const mailOptions = {
    from: {
      name: config.get('mail.from.name'),
      address: config.get('mail.from.address'),
    },
    ...payload,
  }

  mail.sendMail(mailOptions, (error: Error) => {
    if (error) newrelic.noticeError(error)
  })
}
