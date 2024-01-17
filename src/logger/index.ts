import { pinoLogger } from "./pinoLogger";
import { Logger } from "./Logger";

const logger = new Logger(pinoLogger);

export default logger;