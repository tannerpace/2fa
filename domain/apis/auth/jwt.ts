import jwt from 'jsonwebtoken'
import { config } from '../../../utils/config'

const secret = config.JWT_SECRET

export const createToken = (data: any, expiresIn: string) => {
  return jwt.sign(data, secret, { expiresIn: expiresIn })
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, secret)
}
