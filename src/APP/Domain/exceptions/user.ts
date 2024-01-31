import { BaseException } from "./BaseException";

export class InvalidUserIdException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

export class InvalidAgeException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

export class InvalidUserNameException extends BaseException {
    constructor() {
        super("UserName provided is invalid.");
    }
}

export class InvalidPasswordException extends BaseException {
    constructor() {
        super("Password provided is invalid.");
    }
}

export class InvalidCredentialsException extends BaseException {
    constructor() {
        super("Credentials provided are invalid.");
    }
}