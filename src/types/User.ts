export class User {
    id: string;
    name: string;
    email: string;
    userName: string;
    password: string;
    age: number;

    constructor(id: string, name: string, userName: string, email: string, password: string, age: number) {
        this.id = id;
        this.name = name;
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.age = age;
    }
}