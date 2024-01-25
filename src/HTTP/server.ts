import app from "./app";
// import logger from "../APP/Infrastructure/IoC/container";
import { addRoutes } from "./routes";

addRoutes(app);
const httpPort = process.env.HTTP_PORT;

export const startServer = (port?: string) => {
    app.listen(port || httpPort, () => {
        // logger.info(`Server running on port ${port || httpPort}`);
    });
}