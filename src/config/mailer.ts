import nodemailer from 'nodemailer'
import config from '.'
import hbs, { NodemailerExpressHandlebarsOptions } from 'nodemailer-express-handlebars'

const mail = nodemailer.createTransport({
  host: config.get('smtp.host'),
  port: Number(config.get('smtp.port')),
  secure: false,
  auth: {
    user: config.get('mail.username'),
    pass: config.get('mail.password'),
  },
  sender: config.get('mail.from.name'),
  from: config.get('mail.from.address'),
})

const handlebarOptions: NodemailerExpressHandlebarsOptions = {
  viewEngine: {
    partialsDir: 'build/src/emails/',
    defaultLayout: false,
  },
  viewPath: 'build/src/emails/',
}

mail.use('compile', hbs(handlebarOptions))

export default mail
