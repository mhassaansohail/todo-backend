import { BaseException } from "./BaseException";

export class InvalidUserNameException extends BaseException {
    constructor() {
        super("UserName should have atleast 6 characters.");
    }
}

export class InvalidPasswordException extends BaseException {
    constructor() {
        super("Password should have atleast 6 characters.");
    }
}

export class InvalidCredentialsException extends BaseException {
    constructor() {
        super("Credentials provided are invalid.");
    }
}