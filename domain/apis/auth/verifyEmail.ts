import { Locals, idSchema, stringSchema } from '../../../utils/types'
import { z } from 'zod'
import { findUserByEmail, findUserById } from '../user/find'
import { createToken } from './jwt'
import { userDocSchema } from '../../models/user'

const verifyEmailSchema = z.object({
  email: userDocSchema.shape.email,
  value: stringSchema,
})

export const verifyEmail = async (
  params: z.infer<typeof verifyEmailSchema>,
  locals: Locals
) => {
  const parsed = verifyEmailSchema.parse(params)

  console.log('parsed', parsed)
  const user = await findUserByEmail({ email: parsed.email }, locals)

  // find email verification by email and value and created_at > 5 minutes ago
  const emailVerifications = await locals.sql`
    SELECT * FROM email_verifications
    WHERE user_id = ${user.id}
    AND value = ${parsed.value}
    AND created_at > NOW() - INTERVAL '5 minutes'
  `
  const emailVerification = emailVerifications[0]

  // if not found, throw error
  if (!emailVerification) {
    throw new Error('Invalid email verification')
  }

  // update user email_verified
  await locals.sql`
    UPDATE users
    SET email_verified = TRUE
    WHERE id = ${user.id}
  `

  const updatedUser = await findUserById(user.id, locals)

  // delete email verification
  await locals.sql`
    DELETE FROM email_verifications
    WHERE id = ${emailVerification.id}
  `

  const token = createToken(updatedUser, '30d')

  return token
}
