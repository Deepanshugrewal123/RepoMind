import { Router } from 'express'
import { runDiagnostics } from '../services/diagService'

const router = Router()

router.post('/ping', (req, res) => {
  const target = req.body.target
  runDiagnostics(target)
  res.send('Executed')
})

export default router
