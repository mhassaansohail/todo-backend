export class BaseException extends Error {
    message: string;
    stack?: string | undefined;

    constructor(message: string) {
        super(message);
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}

