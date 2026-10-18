import { Router } from 'express'
import { findUserById } from '../services/userService'

const router = Router()

router.get('/user', async (req, res) => {
  const userId = req.query.id
  const result = await findUserById(userId)
  res.json(result)
})

export default router
