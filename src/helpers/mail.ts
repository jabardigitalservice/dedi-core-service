import newrelic from 'newrelic'
import { TemplateOptions } from 'nodemailer-express-handlebars'
import { Options } from 'nodemailer/lib/mailer'
import config from '../config'
import mail from '../config/mailer'

export type Payload = Options & TemplateOptions

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
