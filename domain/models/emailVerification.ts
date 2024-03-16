import { z } from 'zod'
import { idSchema, stringSchema } from '../../utils/types'
import { docSchema } from './doc'

export const emailVerificationSchema = docSchema.extend({
  id: idSchema,
  user_id: idSchema,
  value: stringSchema,
  company_id: idSchema,
  type: z.literal('email_verification').default('email_verification'),
})
