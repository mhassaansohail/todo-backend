import { BaseException } from "./BaseException";

export class PaginationOptionsException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

export class InsufficientRowsException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}