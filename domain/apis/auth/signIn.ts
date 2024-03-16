import { Locals } from '../../../utils/types'
import { z } from 'zod'
import { findUserByEmail } from '../user/find'
import { sendEmail } from '../../clients/email/send'
import cuid from 'cuid'
import { userDocSchema } from '../../models/user'

const signInSchema = z.object({
  email: userDocSchema.shape.email,
})

// send verification email
export const signIn = async (
  params: z.infer<typeof signInSchema>,
  locals: Locals
) => {
  const parsed = signInSchema.parse(params)

  // attepmt to find user by email, will throw error if not found
  const user = await findUserByEmail({ email: parsed.email }, locals)

  const value = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()
    // replace 0 with Z to avoid confusion
    .replace('0', 'Z')

  // insert email verification
  const emailVerificationData = {
    id: cuid(),
    user_id: user.id,
    value,
  }
  await locals.sql.begin(async (sql) => {
    await sql`DELETE FROM email_verifications WHERE user_id = ${user.id}`
    await sql`INSERT INTO email_verifications ${sql(
      emailVerificationData,
      'id',
      'user_id',
      'value'
    )}`
  })

  // send auth email
  await sendEmail({
    tos: [parsed.email],
    subject: 'Verify your 2FA Group email',
    content: `Your verification code is: ${value}`,
  })

  return
}
