import { IUpdateUser } from "./IUpdateUser.dto";

export class UserUpdateDTO {
    private constructor() { };

    static toDomain(user: IUpdateUser) {
        const { userId, ...userObj } = user;
        return { Id: userId, ...userObj }
    }
}