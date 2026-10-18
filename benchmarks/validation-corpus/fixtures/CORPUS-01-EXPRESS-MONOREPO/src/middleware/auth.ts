import { Request, Response, NextFunction } from 'express';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}
