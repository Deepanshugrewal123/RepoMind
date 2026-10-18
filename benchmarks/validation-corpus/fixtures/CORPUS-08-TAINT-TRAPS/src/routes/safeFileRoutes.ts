import { Router } from 'express'
import fs from 'fs'
import path from 'path'

const router = Router()

router.get('/report', (req, res) => {
  const filename = req.query.name
  // Line 10: Safe path traversal defense using path.basename()
  const safeName = path.basename(filename)
  const content = fs.readFileSync(path.join('/var/data', safeName))
  res.send(content)
})

export default router
