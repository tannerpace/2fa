import phone from 'phone'
import { z } from 'zod'
import { sql } from '../domain/clients/sql'

export type Locals = {
  sql: ReturnType<typeof sql>
}

/**
 * Zod schema for dates
 */
export const dateSchema = z.preprocess(
  (arg) =>
    typeof arg == 'string' || arg instanceof Date ? new Date(arg) : arg,
  z.date()
)

export const stringSchema = z.string().trim()

export const idSchema = stringSchema.cuid()

const toE164PhoneNumber = (number: string) =>
  phone(number, {
    validateMobilePrefix: false,
    strictDetection: true,
  })

export const phoneNumberSchema = z.preprocess(
  (arg) => (typeof arg === 'string' ? toE164PhoneNumber(arg).phoneNumber : arg),
  stringSchema.refine((phoneNumber) => toE164PhoneNumber(phoneNumber).isValid, {
    message: `Must be a valid E.164 phone number: https://www.twilio.com/docs/glossary/what-e164`,
  })
)
