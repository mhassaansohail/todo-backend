import { BaseException } from "./BaseException";

export class InvalidTodoIdException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}