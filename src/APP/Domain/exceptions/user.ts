import { BaseException } from "./BaseException";

export class InvalidAgeException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}