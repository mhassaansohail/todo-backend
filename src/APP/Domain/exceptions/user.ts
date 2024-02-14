import { BaseException } from "./BaseException";

export class InvalidUserIdException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

export class InvalidAgeException extends BaseException {
    constructor() {
        super("Invalid age, age should be greater than 1.");
    }
}