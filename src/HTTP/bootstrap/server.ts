import app from "./app";
import { addRoutes } from "./routes";
import { Logger } from "../../APP/Infrastructure/logger/Logger";

const logger = new Logger(); 

addRoutes(app);
const httpPort = process.env.HTTP_PORT;

export const startServer = (port?: string) => {
    app.listen(port || httpPort, () => {
        logger.info(`Server is running on port: ${httpPort || port}.`);
    });
}