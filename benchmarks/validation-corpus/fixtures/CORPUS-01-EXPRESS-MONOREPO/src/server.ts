import express from 'express';
import { getUserById } from './controllers/userController';
import { authMiddleware } from './middleware/auth';
import { logInfo } from './utils/logger';

const app = express();
app.use(express.json());

app.get('/api/users/:id', authMiddleware, getUserById);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logInfo(`Server listening on port ${PORT}`);
});

export default app;
