import { Request, Response } from 'express';
import { db } from '../config/db';

export async function getUserById(req: Request, res: Response): Promise<void> {
  const userId = req.params.id;
  // True Negative trap: Safe parameterized query using $1 parameter placeholder
  const result = await db.query('SELECT id, username, email FROM users WHERE id = $1', [userId]);
  res.json(result.rows[0]);
}
