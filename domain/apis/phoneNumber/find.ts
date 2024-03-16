import { z } from 'zod'
import { phoneNumberSchema } from '../../../utils/types'
import cuid from 'cuid'
import { phoneNumberDocSchema } from '../../models/phoneNumber'

export const phoneNumbers = [
  {
    id: cuid(),
    number: '+18436961767',
    created_at: new Date(),
    provider: 'click_send',
    company_id: cuid(),
  },
  {
    id: cuid(),
    number: '+18436969160',
    created_at: new Date(),
    provider: 'click_send',
    company_id: cuid(),
  },
  // Click Send test number
  {
    id: cuid(),
    number: '+18332653941',
    created_at: new Date(),
    provider: 'click_send',
    company_id: cuid(),
  },
]

const findPhoneNumberByNumberSchema = z.object({
  number: phoneNumberSchema,
})

export const findPhoneNumberByNumber = async (
  params: z.infer<typeof findPhoneNumberByNumberSchema>
) => {
  const parsed = findPhoneNumberByNumberSchema.parse(params)

  // TODO: find from db instead of in-memory
  const phoneNumber = phoneNumbers.find(
    (phoneNumber) => phoneNumber.number === parsed.number
  )

  if (!phoneNumber) {
    throw new Error('Phone Number not found')
  }

  return phoneNumberDocSchema.parse(phoneNumber)
}
