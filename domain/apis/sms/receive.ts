import { Locals, phoneNumberSchema, stringSchema } from '../../../utils/types'
import { z } from 'zod'
import { findForwardsByPhoneNumber } from '../forward/find'
import { sendEmail } from '../../clients/email/send'

const receiveSMSSchema = z.object({
  from: phoneNumberSchema,
  to: phoneNumberSchema,
  content: stringSchema,
})

/**
 * Receives an SMS from a generic SMS provider
 *
 * Lookup which user owns the `to` phone number
 *
 * Find the user's associated email addresses
 *
 * Forward the `content` to the user's associated email addresses
 */
export const receiveSMS = async (
  params: z.infer<typeof receiveSMSSchema>,
  locals: Locals
) => {
  const parsed = receiveSMSSchema.parse(params)

  // TODO: Verify user is active/paid

  const test = await locals.sql`SELECT NOW()`
  console.log('test', test)

  // find phone number's associated forwards
  const forwards = await findForwardsByPhoneNumber({ phoneNumber: parsed.to })

  // forward `content` to the forwards using the specified method

  // TODO: allow other methods
  const emailForwards = forwards.filter((x) => x.method === 'email')
  const tos = emailForwards.map((x) => x.value)
  console.log(`Forwarding SMS to ${tos.join(', ')}`)
  await sendEmail({
    tos,
    subject: `Forwarded message from: ${parsed.from}`,
    content: parsed.content,
  })
}
