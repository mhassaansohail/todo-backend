import { inject, injectable } from "tsyringe";
import User from "../../../../Domain/entities/User";
import { UserRepository } from "../../../../Domain/repositories/UserRepository";
import { PrismaClient } from "@prisma/client";
import { Logger } from "../../../logger/Logger";
import { RepositoryResult, UUIDVo } from "@carbonteq/hexapp";
import { Result } from "@carbonteq/fp";
import { UserDTO } from "../DTO/user.dto";
import { UserNotFound } from "../../../../Domain/exceptions/user/UserNotFound.exception";
import { DbMalfunction } from "../exceptions/shared/DbMalfunction.exception";
import { UserNotFoundWithParams } from "../exceptions/user/UserNotFoundWithParams.exception";

@injectable()
export class PrismaUserRepository extends UserRepository {
    private logger: Logger;
    private prisma: any;
    constructor(prisma: any, @inject("Logger") logger: Logger) {
        super()
        this.logger = logger;
        this.prisma = prisma || new PrismaClient();
    }

    async countTotalRows(queryParams: Partial<User>): Promise<RepositoryResult<number>> {
        try {
            const conditions = {
                OR: [
                    { name: { contains: queryParams.name } },
                    { email: { contains: queryParams.email } }
                ],
            }
            const totalRows = await this.prisma.user.count({
                where: conditions
            });
            return Result.Ok(totalRows);
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new DbMalfunction("countTotalRows"));
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
            const fetchedUsers = await this.prisma.user.findMany({
                skip: offset,
                take: limit,
                where: conditions
            });

            return Result.Ok(fetchedUsers.map((userObj: any) => User.fromObj(UserDTO.toDomain(userObj))));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new DbMalfunction("fetchAllPaginated"));
        }
    }

    async fetchById(userId: UUIDVo): Promise<RepositoryResult<User>> {
        try {
            const serializedUserId = userId.serialize();
            const fetchedUser = await this.prisma.user.findUnique({
                where: { userId: serializedUserId }
            });
            if (fetchedUser !== null) {
                return Result.Ok(User.fromObj(UserDTO.toDomain(fetchedUser)));
            }
            return Result.Err(new Error("User not found."));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new DbMalfunction("fetchById"));
        }
    }

    async fetchByUserNameOrEmail(userName?: string, email?: string): Promise<RepositoryResult<User>> {
        try {
            const fetchedUser = await this.prisma.user.findUnique({
                where: {
                    email,
                    userName
                }
            });
            return fetchedUser ? Result.Ok(User.fromObj(UserDTO.toDomain(fetchedUser))) : Result.Err(new UserNotFoundWithParams("userName or email", `${email || userName}`));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new DbMalfunction("fetchByUserNameOrEmail"));
        }
    }

    async insert(user: User): Promise<RepositoryResult<User>> {
        try {
            const { Id: userId, ...userAttributes } = user.serialize();
            const createdUser = await this.prisma.user.create({
                data: {
                    userId,
                    ...userAttributes
                }
            });
            return Result.Ok(User.fromObj(UserDTO.toDomain(createdUser)));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new DbMalfunction("insert"));
        }
    }

    async update(user: User): Promise<RepositoryResult<User>> {
        try {
            const { Id: userId, ...userAttributes } = user.serialize();
            const updatedUser = await this.prisma.user.update({
                where: { userId: userId },
                data: userAttributes
            });
            return Result.Ok(User.fromObj(UserDTO.toDomain(updatedUser)));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new DbMalfunction("update"));
        }
    }

    async deleteById(userId: UUIDVo): Promise<RepositoryResult<User>> {
        try {
            const removedUser = await this.prisma.user.delete({
                where: { userId: userId.serialize() }
            });
            return removedUser ? Result.Ok(User.fromObj(UserDTO.toDomain(removedUser))) : Result.Err(new UserNotFound(userId.serialize()));;
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new DbMalfunction("deleteById"));
        }
    }
}