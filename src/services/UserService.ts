import { User } from "../types/User";
import { UserRepository } from "../stores";
import { PaginatedCollection } from "../pagination";

export class UserService {
    repository: UserRepository;
    constructor(repoistory: UserRepository) {
        this.repository = repoistory
    }

    async getPaginatedUsers(offset: number, pageSize: number, conditionParams: Partial<User>) {
        try {
            const pageNumber = Math.floor(offset / pageSize) + 1;
            const usersAndCount = await this.repository.fetch(offset, pageSize, conditionParams);
            const paginatedUsers = new PaginatedCollection(usersAndCount.models, usersAndCount.count, pageSize, pageNumber);
            return paginatedUsers;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(userId: string) {
        try {
            return await this.repository.fetchById(userId);
        } catch (error) {
            throw error;
        }
    }

    async getUserByUsername(userName: string) {
        try {
            return await this.repository.fetchByUsername(userName);
        } catch (error) {
            throw error;
        }
    }

    async createUser(user: User) {
        try {
            const existingUserWithEmail = await this.repository.fetchByEmail(user.email);
            const existingUserWithUsername = await this.repository.fetchByUsername(user.userName);
            if (existingUserWithEmail) {
                throw new Error("A user already exists with this email.");
            }
            if (existingUserWithUsername) {
                throw new Error("A user already exists with this username.");
            }
            return await this.repository.create(user);
        } catch (error) {
            throw error;
        }
    }

    async updateUser(userId: string, user: User) {
        try {
            const userExists = await this.repository.fetchById(userId);
            if (!userExists) {
                throw new Error(`User with id: ${userId} does not exist.`);
            }
            const existingUserWithEmail = await this.repository.fetchByEmail(user.email);
            const existingUserWithUsername = await this.repository.fetchByUsername(user.userName);
            if (existingUserWithEmail && existingUserWithEmail.id === userId) {
                throw new Error("A user already exists with this email.");
            }
            if (existingUserWithUsername && existingUserWithUsername.id === userId) {
                throw new Error("A user already exists with this username.");
            }
            return await this.repository.update(userId, user);
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(userId: string) {
        try {
            const userExists = await this.repository.fetchById(userId);
            if (!userExists) {
                throw new Error(`User with id: ${userId} does not exist.`);
            }
            return await this.repository.remove(userId);
        } catch (error) {
            throw error;
        }
    }
}
