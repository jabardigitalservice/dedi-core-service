import config from '.';
import nodemailer from 'nodemailer'

const mail = nodemailer.createTransport({
  host: config.get('smtp.host'),
  port: Number(config.get('smtp.port')),
  secure: false,
  auth: {
    user: config.get('mail.username'),
    pass: config.get('mail.password')
  },
  sender: config.get('mail.from.name'),
  from: config.get('mail.from.address')
})

export default mail
