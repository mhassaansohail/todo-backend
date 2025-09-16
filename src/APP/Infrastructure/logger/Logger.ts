import { pinoLogger } from "./pinoLogger";

export class Logger {
    logger: any;
    constructor() {
        this.logger = pinoLogger;
    }
    info(message: string): void {
        this.logger.info(message);
    }
    error(message: string): void {
        this.logger.error(message);
    }
}