import { z } from 'zod'
import { idSchema, phoneNumberSchema, stringSchema } from '../../utils/types'
import { docSchema } from './doc'

export const phoneNumberDocSchema = docSchema.extend({
  id: idSchema,
  number: phoneNumberSchema, // the acutal phone number
  name: stringSchema.optional(), // the name associated with this phone number for reference
  provider: z.literal('click_send'),
  company_id: idSchema,
  type: z.literal('phone_number').default('phone_number'),
})
