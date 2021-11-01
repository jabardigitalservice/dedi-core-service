import config from '.';
import nodemailer from 'nodemailer'

export default nodemailer.createTransport({
  host: config.get('smtp.host'),
  port: Number(config.get('smtp.port')),
  secure: false,
  auth: {
    user: config.get('mail.username'),
    pass: config.get('mail.password')
  }
})
