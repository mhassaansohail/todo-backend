import { UserAttributes } from "../../types/user";

export class CreateUserCommand {
    private userId: string;
    private name: string;
    private userName: string;
    private email: string;
    private password: string;
    private age: number

    constructor({userId, name, userName, email, password, age}: UserAttributes) {
        this.userId = userId;
        this.name = name;
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.age = age;
    }

    getDetails(): UserAttributes {
        return {
            userId: this.userId,
            name: this.name,
            userName: this.userName,
            email: this.email,
            password: this.password,
            age: this.age
        };
    }
}