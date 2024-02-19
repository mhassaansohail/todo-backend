import User from "../../Domain/entities/User";
import { UserRepository } from "../../Domain/repositories/UserRepository";
import { UserAttributes } from "../../Domain/types/user";
import { PaginatedCollection } from "../../Domain/pagination/PaginatedCollection";
import { Ok, Err } from "oxide.ts";
import { inject, injectable } from "tsyringe";
import { IUniqueIDGenerator } from "../contracts/IUniqueIDGenerator";

@injectable()
export class UserService {
    private repository: UserRepository;
    private idGenerator: IUniqueIDGenerator;
    constructor(@inject("UniqueIDGenerator") idGenerator: IUniqueIDGenerator, @inject("UserRepository") repository: UserRepository) {
        this.repository = repository;
        this.idGenerator = idGenerator;
    }

    async getUsers(offset: number, limit: number, conditionParams: Partial<UserAttributes>): Promise<Ok<PaginatedCollection<User>> | Err<Error>> {
        try {
            const totalUserRows = await this.repository.count(conditionParams);
            const userRows = await this.repository.fetchAll(offset, limit, conditionParams);
            return Ok(new PaginatedCollection(userRows, totalUserRows, offset, limit));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async getUserById(userId: string): Promise<Ok<User> | Err<Error>> {
        try {
            return Ok(await this.repository.fetchById(userId));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async getUserByUsername(userName: string) {
        try {
            return Ok(await this.repository.fetchByUserNameOrEmail(userName));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async createUser(user: UserAttributes): Promise<Ok<User> | Err<Error>> {
        try {
            const userId = this.idGenerator.getUniqueID();
            user.userId = userId;
            const userEntity = User.createByObject({...user});
            return Ok(await this.repository.create(userEntity));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async updateUser(userId: string, user: UserAttributes): Promise<Ok<User> | Err<Error>> {
        try {
            const userEntity = User.createByObject(user);
            return Ok(await this.repository.update(userId, userEntity));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async deleteUser(userId: string): Promise<Ok<User> | Err<Error>> {
        try {
            return Ok(await this.repository.remove(userId));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }
}
