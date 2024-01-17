import { userValidator } from "../validators";

export class User {
    id: string;
    name: string;
    email: string;
    userName: string;
    password: string;
    age: number;

    constructor(id: string = "NULL", name: string = "NULL", userName: string = "NULL", email: string = "null@null.com", password: string = "null", age: number = 0) {
        this.id = id;
        this.name = name;
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.age = age;
        userValidator(this);
    }
}