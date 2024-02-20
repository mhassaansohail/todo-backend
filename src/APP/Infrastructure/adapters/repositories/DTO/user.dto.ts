import User from "../../../../Domain/entities/User";

interface IUser {
    userId: string;
    name: string;
    email: string;
    userName: string;
    password: string;
    age: number;
    createdAt: Date;
    updatedAt: Date;
}

export class UserDTO {

    static toPersistance(user: User) {
        const { Id, name, email, userName, password, age, createdAt, updatedAt } = user.serialize();
        return {
            userId: Id,
            name,
            email,
            userName,
            password,
            age,
            createdAt,
            updatedAt
        };
    }

    static toDomain(user: IUser) {
        const { userId, ...userObj } = user;
        return { Id: userId, ...userObj }
    }
}