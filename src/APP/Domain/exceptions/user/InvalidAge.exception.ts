import { BaseException } from "../BaseException";

export class InvalidAgeException extends BaseException {
    constructor() {
        super("Invalid age, age should be greater than 5.");
    }
}