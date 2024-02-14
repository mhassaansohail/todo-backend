import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import '../../APP/Infrastructure/dependencyInjections/container';
import { addRoutes } from '../routers/routes';


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

addRoutes(app);

export default app;