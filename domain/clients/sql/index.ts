import postgres from 'postgres'
import { config } from '../../../utils/config'

export const sql = () => {
  return postgres({
    host: config.PGHOST,
    database: config.PGDATABASE,
    username: config.PGUSER,
    password: config.PGPASSWORD,
    ssl: { rejectUnauthorized: false },
  })
}
