import { InvalidAgeException } from "../exceptions/user";
import { UserAttributes } from "../types/user";

class User {
    userId: string;
    name: string;
    email: string;
    userName: string;
    password: string;
    age: number;

    constructor(userId: string = "NULL", name: string = "NULL", userName: string = "NULL", email: string = "null@null.com", password: string = "null", age: number = 1) {
        this.enforceAgeRequirement(age);
        this.userId = userId;
        this.name = name;
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.age = age;
    }

    static createByParams(userId: string, name: string, userName: string, email: string, password: string, age: number): User {
        return new User(userId, name, userName, email, password, age);
    }

    static createByObject({ userId, name, userName, email, password, age }: UserAttributes): User {
        return new User(userId, name, userName, email, password, age);
    }
    enforceAgeRequirement(age: number): void {
        if (age < 1) {
            throw new InvalidAgeException("Invalid age, age should be greater than 1.");
        }
    }
}

export default User;