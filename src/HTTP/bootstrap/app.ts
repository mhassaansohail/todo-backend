import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import '../../APP/Infrastructure/dependencyInjections/container';
import { addRoutes } from '../routers/routes';
import { getSentryClient } from '../../APP/Infrastructure/monitoring/sentry';
import { addErrorInterceptor } from '../middlewares';


const app = express();

const Sentry = getSentryClient(app);
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
addRoutes(app);
// addErrorInterceptor(app)
// app.use(Sentry.Handlers.errorHandler());
export default app;