import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import '../../APP/Infrastructure/dependencyInjections/container';
import { getSentryClient } from '../../APP/Infrastructure/monitoring/sentry';


const app = express();

const Sentry = getSentryClient(app);
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;