import { Router } from 'express'
import { Client } from 'pg'

const router = Router()
const db = new Client()

router.get('/safe-user', async (req, res) => {
  const userId = req.query.id
  // Line 10: Safe parameterized query using $1 binding array (Negative Test / Trap)
  const result = await db.query('SELECT * FROM users WHERE id = $1', [userId])
  res.json(result)
})

export default router
