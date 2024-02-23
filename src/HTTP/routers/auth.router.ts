import express from 'express';
import { authController } from '../../APP/Infrastructure/dependencyInjections/container';

const authRouter = express.Router();
authRouter.post('/login', authController.login);
authRouter.get('/google/callback', authController.callback);

export default authRouter;