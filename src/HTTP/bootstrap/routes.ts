import app from './app';
import swaggerUi from 'swagger-ui-express';
import { resolve } from "path";
import { AuthMiddleware } from '../middlewares/Auth.middleware';
import { config } from '../../APP/Infrastructure/config';
import { ErrorInterceptor } from '../middlewares/ErrorInterceptor.middleware';
import authRouter from '../routers/auth.router';
import userRouter from '../routers/user.router';
import todoRouter from '../routers/todo.router';

const errorInterceptor = new ErrorInterceptor();
const authMiddleware = new AuthMiddleware();


const swaggerFilePath = String(config.swaggerDocFile);
// const swaggerDocument = import(resolve(swaggerFilePath));
// app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/auth', authRouter);
app.use('/api/user', authMiddleware.authenticateUser, userRouter);
app.use('/api/todo', authMiddleware.authenticateUser, todoRouter);
app.use(errorInterceptor.handler);