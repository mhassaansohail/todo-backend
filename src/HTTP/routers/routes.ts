import swaggerUi from 'swagger-ui-express';
import { resolve } from "path";
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import authRouter from './authRouter';
import userRouter from './userRouter';
import todoRouter from './todoRouter';
import { config } from '../../APP/Infrastructure/config';

const authMiddleware = new AuthMiddleware();

export const addRoutes = async (app: any): Promise<void> => {
    const swaggerFilePath = String(config.swaggerDocFile);
    const swaggerDocument = await import(resolve(swaggerFilePath));
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use('/auth', authRouter);
    app.use('/api/user', authMiddleware.authenticateUser, userRouter);
    app.use('/api/todo', authMiddleware.authenticateUser, todoRouter);
}