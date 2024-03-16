import { z } from 'zod'
import { idSchema, stringSchema } from '../../utils/types'
import { docSchema } from './doc'

export const forwardDocSchema = docSchema.extend({
  method: z.literal('email'), // TODO: add more methods
  value: stringSchema, // the string of text to send to using the `method`

  parent: idSchema, // parent will always be a phone number id

  // Defaults Fields
  type: z.literal('forward').default('forward'),
})
