import dotenv from 'dotenv';
import { resolve } from 'path';
import { Command } from 'commander';
import { startExpressApp } from './expressApp';
import logger from './logger';

dotenv.config({ path: resolve(__dirname, './.env') });


const program = new Command();

program
    .option('-p, --port <port>', 'Port to run the server on', process.env.HTTP_PORT)
    .parse(process.argv);

const options = program.opts();
const port = options.port;

if (isNaN(port) || port <= 0 || port > 65535) {
    logger.error('Invalid port number');
    process.exit(1);
}

startExpressApp(logger, port);
