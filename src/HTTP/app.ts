import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import '../APP/Infrastructure/IoC/container';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;