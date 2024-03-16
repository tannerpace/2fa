// this will be a generic doc schema that all other doc types in the system will inherit

import { z } from 'zod'
import { dateSchema, idSchema } from '../../utils/types'

export const docSchema = z.object({
  id: idSchema,
  type: z.enum(['forward', 'user', 'phone_number', 'email_verification']),
  created_at: dateSchema,
})
