import bcrypt from 'bcryptjs'
import bcryptRounds from '../config/bcryptRounds'

export const passwordHash = (password: string): string => {
  const salt = bcrypt.genSaltSync(bcryptRounds)
  return bcrypt.hashSync(password, salt)
}
