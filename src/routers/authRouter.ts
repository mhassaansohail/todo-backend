import express from 'express';
import { AuthController } from '../controllers';

const authRouter = express.Router();
authRouter.post('/login', AuthController.login);
authRouter.get('/google/callback', AuthController.callback);

export default authRouter;