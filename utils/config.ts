import dotenv from 'dotenv'
import { z } from 'zod'
dotenv.config()

const confirSchema = z.object({
  PORT: z.number().min(1024).max(49151),

  CLICK_SEND_USERNAME: z.string().min(1),
  CLICK_SEND_API_KEY: z.string().min(1),
  CLICK_SEND_FROM: z.string().min(1),

  PGHOST: z.string().min(1),

  PGUSER: z.string().min(1),
  PGPASSWORD: z.string().min(1),
  PGDATABASE: z.string().min(1),

  JWT_SECRET: z.string().min(1),
})

export const config = confirSchema.parse({
  PORT: process.env.PORT || 3000,

  CLICK_SEND_USERNAME: process.env.CLICK_SEND_USERNAME,
  CLICK_SEND_API_KEY: process.env.CLICK_SEND_API_KEY,
  CLICK_SEND_FROM: process.env.CLICK_SEND_FROM,

  PGHOST: process.env.PGHOST,
  PGUSER: process.env.PGUSER,
  PGPASSWORD: process.env.PGPASSWORD,
  PGDATABASE: process.env.PGDATABASE,

  JWT_SECRET: process.env.JWT_SECRET,
})
