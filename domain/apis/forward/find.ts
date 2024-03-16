import { z } from 'zod'
import { phoneNumberSchema } from '../../../utils/types'
import cuid from 'cuid'
import { findPhoneNumberByNumber, phoneNumbers } from '../phoneNumber/find'
import { forwardDocSchema } from '../../models/forward'

export const forwards = [
  {
    id: cuid(),
    type: 'forward',
    method: 'email',
    value: 'patebry@gmail.com',
    parent: phoneNumbers[2].id,
    created_at: new Date(),
    updatedAt: new Date(),
  },
  {
    id: cuid(),
    type: 'forward',
    method: 'email',
    value: 'emerson.luke9@gmail.com',
    parent: phoneNumbers[2].id,
    created_at: new Date(),
    updatedAt: new Date(),
  },
]

const findForwardsByPhoneNumberSchema = z.object({
  phoneNumber: phoneNumberSchema,
})

export const findForwardsByPhoneNumber = async (
  params: z.infer<typeof findForwardsByPhoneNumberSchema>
) => {
  const parsed = findForwardsByPhoneNumberSchema.parse(params)

  console.log(parsed)

  // Find the phone number first
  const phoneNumber = await findPhoneNumberByNumber({
    number: parsed.phoneNumber,
  })

  // Find all the forwards by the parent value
  const forwardDocs = forwards.filter((x) => x.parent === phoneNumber.id)

  return forwardDocs.map((f) => forwardDocSchema.parse(f))
}
