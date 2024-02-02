import { inject, injectable } from "tsyringe";
import User from "../../../Domain/entities/User";
import { UserRepository } from "../../../Domain/repositories/UserRepository";
import { PrismaClient } from "@prisma/client";
import { Logger } from "../../logger/Logger";
import { UserDTO } from "../../../shared/DTO/user.dto";
const prisma = new PrismaClient();

@injectable()
export class PrismaUserRepository implements UserRepository {
    private logger: Logger;
    constructor(@inject("Logger") logger: Logger) {
        this.logger = logger;
    }

    async count(queryParams: Partial<User>): Promise<number> {
        try {
            const conditions = {
                OR: [
                    { name: { contains: queryParams.name } },
                    { email: { contains: queryParams.email } }
                ],
            }
            const totalRows = await prisma.user.count({
                where: conditions
            });
            return totalRows;
        } catch (error: any) {
            this.logger.error(error.message);
            throw new Error(error.message);
        }
    }

    async fetchAll(offset: number, limit: number, queryParams: Partial<User>): Promise<User[]> {
        try {
            const conditions = {
                OR: [
                    { name: { contains: queryParams.name } },
                    { email: { contains: queryParams.email } }
                ],
            }
            const fetchedUsers = await prisma.user.findMany({
                skip: offset,
                take: limit,
                where: conditions
            });

            return fetchedUsers.map(userObj => User.createByObject(userObj));
        } catch (error: any) {
            this.logger.error(error.message);
            throw new Error(error.message);
        }
    }

    async fetchById(userId: string): Promise<User> {
        try {
            const fetchedUser = await prisma.user.findUnique({
                where: { userId }
            });
            if (fetchedUser !== null) {
                return User.createByObject(fetchedUser);
            }
            throw new Error("User not found.");
        } catch (error: any) {
            this.logger.error(error.message);
            throw new Error(error.message);
        }
    }

    async fetchByUserNameOrEmail(userName?: string, email?: string): Promise<User> {
        try {
            const fetchedUser = await prisma.user.findUnique({
                where: {
                    email,
                    userName
                }
            });
            if (fetchedUser !== null) {
                return User.createByObject(fetchedUser);
            }
            this.logger.error("User not found.");
            throw new Error("User not found.");
        } catch (error: any) {
            this.logger.error(error.message);
            throw new Error(error.message);
        }
    }

    async create(user: User): Promise<User> {
        try {
            const persistableUser = UserDTO.toPersistence(user);
            const createdUser = await prisma.user.create({
                data: persistableUser
            });
            return User.createByObject(createdUser);
        } catch (error: any) {
            this.logger.error(error.message);
            throw new Error(error.message);
        }
    }

    async update(userId: string, user: User): Promise<User> {
        try {
            const { userId: omittedUserId, ...persistableUser } = UserDTO.toPersistence(user);
            const updatedUser = await prisma.user.update({
                where: { userId },
                data: persistableUser
            });
            return User.createByObject(updatedUser);
        } catch (error: any) {
            this.logger.error(error.message);
            throw new Error(error.message);
        }
    }

    async remove(userId: string): Promise<User> {
        try {
            const removedUser = await prisma.user.delete({
                where: { userId }
            });
            return User.createByObject(removedUser);
        } catch (error: any) {
            this.logger.error(error.message);
            throw new Error(error.message);
        }
    }
}