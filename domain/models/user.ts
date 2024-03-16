import { z } from 'zod'
import { idSchema, stringSchema } from '../../utils/types'
import { docSchema } from './doc'

export const userDocSchema = docSchema.extend({
  id: idSchema,
  email: stringSchema.email(),
  first_name: stringSchema,
  last_name: stringSchema,
  company_id: idSchema,
  type: z.literal('user').default('user'),
})
