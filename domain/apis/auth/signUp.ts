import { Locals } from '../../../utils/types'
import { z } from 'zod'
import { findUserByEmail } from '../user/find'
import { sendEmail } from '../../clients/email/send'
import cuid from 'cuid'
import { userDocSchema } from '../../models/user'

const signUpSchema = z.object({
  email: userDocSchema.shape.email,
  first_name: userDocSchema.shape.first_name,
  last_name: userDocSchema.shape.last_name,
})

export const signUp = async (
  params: z.infer<typeof signUpSchema>,
  locals: Locals
) => {
  const parsed = signUpSchema.parse(params)

  // check if user exists
  const user = await findUserByEmail({ email: parsed.email }, locals).catch(
    () => null
  )

  if (user) {
    throw new Error('User already exists')
  }

  const companyData = {
    id: cuid(),
    name: parsed.email,
  }
  const userData = {
    id: cuid(),
    email: parsed.email,
    first_name: parsed.first_name,
    last_name: parsed.last_name,
    company_id: companyData.id,
  }
  const value = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()
    // replace 0 with Z to avoid confusion
    .replace('0', 'Z')
  const emailVerificationData = {
    id: cuid(),
    user_id: userData.id,
    // value should be a random string of capital letters and numbers. Length 6
    value,
  }
  await locals.sql.begin(async (sql) => {
    await sql`INSERT INTO companies ${sql(companyData, 'id', 'name')}`
    await sql`INSERT INTO users ${sql(
      userData,
      'id',
      'email',
      'company_id',
      'first_name',
      'last_name'
    )}`

    await sql`DELETE FROM email_verifications WHERE user_id = ${userData.id}`
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

  // const token = createToken(userData, '30d')

  // return token
  return
}
