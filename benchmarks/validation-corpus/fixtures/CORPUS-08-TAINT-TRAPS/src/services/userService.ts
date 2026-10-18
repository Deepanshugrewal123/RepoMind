import { queryDatabase } from '../db/client'

export function findUserById(userId: string) {
  const sql = "SELECT * FROM users WHERE id = '" + userId + "'"
  return queryDatabase(sql)
}
