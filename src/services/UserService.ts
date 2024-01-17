import { User } from "../domain/entities";
import { PaginatedCollection } from "../pagination";
import { Ok, Err, Result } from "oxide.ts";

export class UserService {
    repository: any;
    constructor(repoistory: any) {
        this.repository = repoistory
    }

    async getUsers(offset: number, limit: number, conditionParams: Partial<User>) {
        try {
            const totalUserRows = await this.repository.count(conditionParams);
            const userRows = await this.repository.fetchAll(offset, limit, conditionParams);
            return Result(new PaginatedCollection(userRows, totalUserRows, offset, limit));
        } catch (error) {
            return Err(error);
        }
    }

    async getUserById(userId: string) {
        try {
            return Result(await this.repository.fetchById(userId));
        } catch (error) {
            return Err(error);
        }
    }

    async getUserByUsername(userName: string) {
        try {
            return Result(await this.repository.fetchByUsername(userName));
        } catch (error) {
            return Err(error);
        }
    }

    async createUser(user: User) {
        try {
            const existingUserWithEmail = await this.repository.fetchByEmail(user.email);
            const existingUserWithUsername = await this.repository.fetchByUsername(user.userName);
            if (existingUserWithEmail) {
                return Err(new Error("A user already exists with this email."));
            }
            if (existingUserWithUsername) {
                return Err(new Error("A user already exists with this username."));
            }
            return Result(await this.repository.create(user));
        } catch (error) {
            return Err(error);
        }
    }

    async updateUser(userId: string, user: User) {
        try {
            const userExists = await this.repository.fetchById(userId);
            if (!userExists) {
                return Err(new Error(`User with id: ${userId} does not exist.`));
            }
            const existingUserWithEmail = await this.repository.fetchByEmail(user.email);
            const existingUserWithUsername = await this.repository.fetchByUsername(user.userName);
            if (existingUserWithEmail && existingUserWithEmail.id === userId) {
                return Err(new Error("A user already exists with this email."));
            }
            if (existingUserWithUsername && existingUserWithUsername.id === userId) {
                return Err(new Error("A user already exists with this username."));
            }
            return Result(await this.repository.update(userId, user));
        } catch (error) {
            return Err(error);
        }
    }

    async deleteUser(userId: string) {
        try {
            const userExists = await this.repository.fetchById(userId);
            if (!userExists) {
                return Err(new Error(`User with id: ${userId} does not exist.`));
            }
            return Result(await this.repository.remove(userId));
        } catch (error) {
            return Err(error);
        }
    }
}
