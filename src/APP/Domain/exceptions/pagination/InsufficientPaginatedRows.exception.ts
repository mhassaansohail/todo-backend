import { BaseException } from "../BaseException";

export class InsufficientPaginatedRowsException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}