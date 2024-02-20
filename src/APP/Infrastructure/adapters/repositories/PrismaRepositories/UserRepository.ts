import { inject, injectable } from "tsyringe";
import User from "../../../../Domain/entities/User";
import { UserRepository } from "../../../../Domain/repositories/UserRepository";
import { PrismaClient } from "@prisma/client";
import { Logger } from "../../../logger/Logger";
import { RepositoryResult, UUIDVo } from "@carbonteq/hexapp";
import { Result } from "@carbonteq/fp";
import { UserDTO } from "../DTO/user.dto";

const prisma = new PrismaClient();

@injectable()
export class PrismaUserRepository extends UserRepository {
    private logger: Logger;
    constructor(@inject("Logger") logger: Logger) {
        super()
        this.logger = logger;
    }

    async countTotalRows(queryParams: Partial<User>): Promise<RepositoryResult<number>> {
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
            return Result.Ok(totalRows);
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new Error(error.message));
        }
    }

    async fetchAllPaginated(offset: number, limit: number, queryParams: Partial<User>): Promise<RepositoryResult<User[]>> {
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

            return Result.Ok(fetchedUsers.map(userObj => User.fromObj(UserDTO.toDomain(userObj))));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new Error(error.message));
        }
    }

    async fetchById(userId: UUIDVo): Promise<RepositoryResult<User>> {
        try {
            const serializedUserId = userId.serialize();
            const fetchedUser = await prisma.user.findUnique({
                where: { userId: serializedUserId }
            });
            if (fetchedUser !== null) {
                return Result.Ok(User.fromObj(UserDTO.toDomain(fetchedUser)));
            }
            return Result.Err(new Error("User not found."));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new Error(error.message));
        }
    }

    async fetchByUserNameOrEmail(userName?: string, email?: string): Promise<RepositoryResult<User>> {
        try {
            const fetchedUser = await prisma.user.findUnique({
                where: {
                    email,
                    userName
                }
            });
            if (fetchedUser !== null) {
                return Result.Ok(User.fromObj(UserDTO.toDomain(fetchedUser)));
            }
            return Result.Err(new Error("User not found."));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new Error(error.message));
        }
    }

    async insert(user: User): Promise<RepositoryResult<User>> {
        try {
            const createdUser = await prisma.user.create({
                data: user
            });
            return Result.Ok(User.fromObj(UserDTO.toDomain(createdUser)));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new Error(error.message));
        }
    }

    async update(user: User): Promise<RepositoryResult<User>> {
        try {
            const { Id: userId, ...persistableUser } = user;
            const updatedUser = await prisma.user.update({
                where: { userId: userId.serialize() },
                data: persistableUser
            });
            return Result.Ok(User.fromObj(UserDTO.toDomain(updatedUser)));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new Error(error.message));
        }
    }

    async deleteById(userId: UUIDVo): Promise<RepositoryResult<User>> {
        try {
            const removedUser = await prisma.user.delete({
                where: { userId: userId.serialize() }
            });
            return Result.Ok(User.fromObj(UserDTO.toDomain(removedUser)));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new Error(error.message));
        }
    }
}