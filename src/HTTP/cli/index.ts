import dotenv from 'dotenv';
dotenv.config();
import { config } from '../../APP/Infrastructure/config';
import { Command } from 'commander';
import app from '../bootstrap/app';
import { Logger } from "../../APP/Infrastructure/logger/Logger";

const program = new Command();
const logger = new Logger();

const httpPort = config.httpPort;

program
    .option('-p, --port <port>', 'Port to run the server on')
    .parse(process.argv);

const options = program.opts();
const port = options.port;

const startServer = (port?: string) => {
    app.listen(port || httpPort, () => {
        logger.info(`Server is running on port: ${port || httpPort}.`);
    });
};

startServer(port);