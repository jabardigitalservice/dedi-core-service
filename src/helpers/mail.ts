import config from '../config'
import mail from '../config/mailer'

export interface Payload {
  to: string
  subject: string
  text: string
  html?: string
}

export const sendMail = (payload: Payload): void => {
  const mailOptions = {
    from: {
      name: config.get('mail.from.name'),
      address: config.get('mail.from.address')
    },
    ...payload
  }

  mail.sendMail(mailOptions, (err) => {
    if (err) throw err
  })
}
