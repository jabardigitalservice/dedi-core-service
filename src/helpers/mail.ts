import mail from '../config/mailer'

export interface Payload {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendMail = (mailOptions: Payload): void => {
  mail.sendMail(mailOptions, (err) => {
    if (err) throw err
  })
}
