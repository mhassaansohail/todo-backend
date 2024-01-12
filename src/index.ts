import dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '../.env') });
import express from 'express';
import cors from 'cors';
import { AuthRouter, UserRouter, TodoRouter } from './routers';
import { AuthMiddleware } from './middlewares/AuthMiddleware';

const expressApp = express();

expressApp.use(cors());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

expressApp.use('/api/auth', AuthRouter);
expressApp.use('/api/user', AuthMiddleware.authenticateUser, UserRouter);
expressApp.use('/api/todo', AuthMiddleware.authenticateUser, TodoRouter);

const HTTP_PORT: string = String(process.env.HTTP_PORT);

expressApp.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});

export default expressApp;