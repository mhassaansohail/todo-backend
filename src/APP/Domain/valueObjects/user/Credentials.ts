import { InvalidCredentialsException, InvalidPasswordException, InvalidUserNameException } from "../../exceptions/credentials";

export class Credentials {
    private readonly userName: string;
    private readonly password: string;

    constructor(userName: string, password: string) {
        this.isValid(userName, password);
        this.userName = userName;
        this.password = password;
    }

    static create(userName: string, password: string): Credentials {
        return new Credentials(userName, password);
    }

    get _username(): string {
        return this.userName;
    }

    get _password(): string {
        return this.password;
    }

    equals(other: Credentials) {
        return (this.userName === other.userName && this.password === other.password);
    }

    isValid(userName: string, password: string) {
        if (!userName || !password) {
            throw new InvalidCredentialsException();
        }
        if (userName.length < 6) {
            throw new InvalidUserNameException();
        }
        if (password.length < 6) {
            throw new InvalidPasswordException();
        }
    }
}