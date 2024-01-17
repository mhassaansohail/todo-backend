import { BaseLogger } from "./BaseLogger";

export class Logger implements BaseLogger {
    logger: any;
    constructor(logger: any) {
        this.logger = logger;
    }
    info(message: string) {
        this.logger.info(message);
    }
    error(message: string) {
        this.logger.error(message);
    }
}