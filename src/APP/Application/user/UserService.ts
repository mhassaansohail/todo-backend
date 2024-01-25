import User from "../../Domain/entities/User";
import { UserRepository } from "../../Domain/repositories/UserRepository";
import { UserAttributes } from "../../Domain/types/user";
import { PaginatedCollection } from "../../Domain/pagination/PaginatedCollection";
import { Ok, Err } from "oxide.ts";
import { inject, injectable } from "tsyringe";
import { Logger } from "../../Infrastructure/logger/Logger";

@injectable()
export class UserService {
    constructor(@inject("Logger") private logger: Logger, @inject("UserRepository") private repository: UserRepository) {
        this.logger = logger;
        this.repository = repository;
    }

    async getUsers(offset: number, limit: number, conditionParams: Partial<UserAttributes>) {
        try {
            const totalUserRows = await this.repository.count(conditionParams);
            const userRows = await this.repository.fetchAll(offset, limit, conditionParams);
            return Ok(new PaginatedCollection(userRows, totalUserRows, offset, limit));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async getUserById(userId: string) {
        try {
            return Ok(await this.repository.fetchById(userId));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async getUserByUsername(userName: string) {
        try {
            return Ok(await this.repository.fetchByUsername(userName));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async createUser(user: UserAttributes) {
        try {
            const userEntity = User.createByObject(user);
            return Ok(await this.repository.create(userEntity));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async updateUser(userId: string, user: UserAttributes) {
        try {
            const userEntity = User.createByObject(user);
            return Ok(await this.repository.update(userId, userEntity));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async deleteUser(userId: string) {
        try {
            return Ok(await this.repository.remove(userId));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }
}
