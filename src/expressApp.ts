import express from 'express';
import cors from 'cors';
// import { AuthRouter, UserRouter, TodoRouter } from './routers';
import { authRouter, userRouter, todoRouter } from './routers';
import { authMiddleware } from './middlewares';

export const startExpressApp = (logger: any, httpPort: string): void => {
    const expressApp = express();

    expressApp.use(cors());
    expressApp.use(express.json());
    expressApp.use(express.urlencoded({ extended: true }));

    expressApp.use('/auth', authRouter);
    expressApp.use('/api/user', authMiddleware, userRouter);
    // expressApp.use('/api/user', authMiddleware, UserRouter);
    // expressApp.use('/api/todo', authMiddleware, TodoRouter);
    expressApp.use('/api/todo', todoRouter);

    expressApp.listen(httpPort, () => {
        logger.info(`Server running on port ${httpPort}`);
    });
}