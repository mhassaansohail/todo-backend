import { User } from "../types/User";
import { UserRepository } from "../stores";
import { PaginatedCollection } from "../pagination";

export class UserService {
    repository: UserRepository;
    constructor(repoistory: UserRepository) {
        this.repository = repoistory
    }

    async getPaginatedUsers(pageNumber: number, recordsPerPage: number, conditionParams: Partial<User>) {
        try {
            const totalRecords = await this.repository.count();
            const totalPages = totalRecords / recordsPerPage;
            if (totalPages <= 0) {
                throw new Error('Records requested exceed total records available.')
            }
            if (pageNumber > totalPages) {
                throw new Error('Page number requested exceeds total pages available.')
            }
            const offset = recordsPerPage * (pageNumber - 1);
            const usersAndCount = await this.repository.fetch(offset, recordsPerPage, conditionParams);
            const paginatedUsers: PaginatedCollection<User> = new PaginatedCollection(usersAndCount.models, usersAndCount.count, recordsPerPage, pageNumber, totalPages);
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
