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

    static toDomain(user: IUser) {
        const { userId, ...userObj } = user;
        return { Id: userId, ...userObj }
    }
}