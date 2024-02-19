import { InvalidAgeException } from "../exceptions/user";
import { UserAttributes } from "../types/user";
import { Credentials } from "../valueObjects/user/Credentials";

class User {
    userId: string;
    name: string;
    email: string;
    credentials: Credentials;
    age: number;

    constructor(userId: string = "NULL", name: string = "NULL", userName: string = "NULL", email: string = "null@null.com", password: string = "null", age: number = 1) {
        this.enforceMinAgeLimit(age);
        this.userId = userId;
        this.name = name;
        this.credentials = Credentials.create(userName, password);
        this.email = email;
        this.age = age;
    }

    get _userName() {
        return this.credentials._username;
    }

    get _password() {
        return this.credentials._password;
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