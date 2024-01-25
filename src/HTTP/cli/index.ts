import dotenv from 'dotenv';
dotenv.config();
import { Command } from 'commander';
import { startServer } from '../server';

const program = new Command();


program
.option('-p, --port <port>', 'Port to run the server on')
.parse(process.argv);

const options = program.opts();
const port = options.port;

startServer(port);