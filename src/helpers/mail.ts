import config from '../config'
import mail from '../config/mailer'
import Sentry from '../config/sentry'

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
      address: config.get('mail.from.address')
    },
    ...payload
  }

  mail.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err);
      Sentry.captureException(err)
    }
  })
}
