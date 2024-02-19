import { InvalidAgeException } from "../exceptions/user/InvalidAge.exception";
import { UserAttributes } from "../types/user";

class User {
    userId: string;
    name: string;
    email: string;
    userName: string;
    password: string;
    age: number;

    constructor(userId: string, name: string, userName: string, email: string, password: string, age: number) {
        this.enforceMinAgeLimit(age);
        this.userId = userId;
        this.name = name;
        this.userName = userName;
        this.password = password;
        this.email = email;
        this.age = age;
    }

    get _userName() {
        return this.userName;
    }

    get _password() {
        return this.password;
    }

    static createByParams(userId: string, name: string, userName: string, email: string, password: string, age: number): User {
        return new User(userId, name, userName, email, password, age);
    }

    static createByObject({ userId, name, userName, email, password, age }: UserAttributes): User {
        return new User(userId, name, userName, email, password, age);
    }

    enforceMinAgeLimit(age: number): void {
        if (age < 1) {
            throw new InvalidAgeException();
        }
    }
}

export default User;