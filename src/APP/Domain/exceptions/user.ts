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
    constructor(message: string) {
        super(message);
    }
}

export class InvalidPasswordException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

export class InvalidCredentialsException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}