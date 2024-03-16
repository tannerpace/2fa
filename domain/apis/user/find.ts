import { z } from 'zod'
import { Locals } from '../../../utils/types'
import { userDocSchema } from '../../models/user'

const findUserByEmailSchema = z.object({
  email: z.string().email(),
})

export const findUserByEmail = async (
  params: z.infer<typeof findUserByEmailSchema>,
  locals: Locals
) => {
  const parsed = findUserByEmailSchema.parse(params)

  const users =
    await locals.sql`SELECT * FROM users WHERE email = ${parsed.email}`

  const parsedUser = userDocSchema.parse(users[0])

  return parsedUser
}

export const findUserById = async (id: string, locals: Locals) => {
  const users = await locals.sql`SELECT * FROM users WHERE id = ${id}`

  console.log('users', users)
  const parsedUser = userDocSchema.parse(users[0])

  return parsedUser
}
