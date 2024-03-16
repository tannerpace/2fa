import { NextFunction, Request, Response } from 'express'
import { sql } from '../domain/clients/sql'

// Async error handler wrapper
export function asyncErrorHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}

// Middleware to add sql to request
// This will also end the sql connection after the request is finished
export function addSql(req: Request, res: Response, next: NextFunction) {
  console.log('Starting SQL connection')
  res.locals.sql = sql()
  next()

  res.on('finish', () => {
    console.log('Ending SQL connection')
    res.locals.sql.end()
  })
}
