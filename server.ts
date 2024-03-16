import { NextFunction, Request, Response } from 'express'
import express from 'express'
import { config } from './utils/config'
import { receiveSMS } from './domain/apis/sms/receive'
import { Locals } from './utils/types'
import { addSql, asyncErrorHandler } from './utils/middleware'
import { signUp } from './domain/apis/auth/signUp'
import { verifyEmail } from './domain/apis/auth/verifyEmail'
import { signIn } from './domain/apis/auth/signIn'

const app = express()
app.use(express.json())

app.post(
  '/hooks/sms/receive',
  express.urlencoded({ extended: true }),
  addSql,
  asyncErrorHandler(async (req: Request, res: Response) => {
    // TODO: verify webhook from SMS provider
    const input = {
      from: req.body.from,
      to: req.body.to,
      content: req.body.message,
    }

    console.log('Received SMS: ', input)
    await receiveSMS(input, res.locals as Locals)
      // Always return 200 to SMS provider
      .catch((err) => {
        console.error('Error receiving SMS', err)
      })

    res.status(200).json({ ok: true })
  })
)

app.post(
  '/api/auth/signUp',
  addSql,
  asyncErrorHandler(async (req: Request, res: Response) => {
    const input = {
      email: req.body.email,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    }

    console.log('Received signUp: ', input)
    await signUp(input, res.locals as Locals)

    res.status(200).json({ ok: true })
  })
)

app.post(
  '/api/auth/signIn',
  addSql,
  asyncErrorHandler(async (req: Request, res: Response) => {
    const input = {
      email: req.body.email,
    }

    console.log('Received signIn: ', input)
    await signIn(input, res.locals as Locals)

    res.status(200).json({ ok: true })
  })
)

app.post(
  '/api/auth/verifyEmail',
  addSql,
  asyncErrorHandler(async (req: Request, res: Response) => {
    const input = {
      email: req.body.email,
      value: req.body.value,
    }

    console.log('Received verifyEmail: ', input)
    const token = await verifyEmail(input, res.locals as Locals)

    res.status(200).json({ ok: true, token })
  })
)

// Generic Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack) // Log error stack to console for debugging

  res.status(500).json({ ok: false })
})

app.listen(config.PORT, () => {
  console.log(`Server is running on http://localhost:${config.PORT}`)
})
