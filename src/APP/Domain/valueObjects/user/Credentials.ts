import { InvalidCredentialsException } from "../../exceptions/user";

export class Credentials {
    private readonly _userName: string;
    private readonly _password: string;

    constructor(userName: string, password: string) {
        this.isValid(userName, password);
        this._userName = userName;
        this._password = password;
    }

    get username(): string {
        return this._userName;
    }

    get password(): string {
        return this._password;
    }

    equals(other: Credentials) {
        return (this._userName === other._userName && this._password === other._password);
    }

    isValid(userName: string, password: string) {
        if (!userName || !password) {
            throw new InvalidCredentialsException("Credentials provided are invalid.");
        }
    }
}