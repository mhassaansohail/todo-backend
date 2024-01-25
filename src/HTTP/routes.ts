import swaggerUi from 'swagger-ui-express';
import { resolve } from "path";
import { AuthMiddleware } from './middlewares/AuthMiddleware';
import authRouter from './routers/authRouter';
import userRouter from './routers/userRouter';
import todoRouter from './routers/todoRouter';

const authMiddleware = new AuthMiddleware();

export const addRoutes = async (app: any): Promise<void> => {
    const swaggerFilePath = String(process.env.SWAGGER_DOC_FILE);
    const swaggerDocument = await import(resolve(swaggerFilePath));
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use('/auth', authRouter);
    app.use('/api/user', authMiddleware.authenticateUser, userRouter);
    app.use('/api/todo', authMiddleware.authenticateUser, todoRouter);
}