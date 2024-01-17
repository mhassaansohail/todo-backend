import { EntityFactory } from "domain/entityFactories";
import { User } from "../domain/entities";
import { UserRepository } from "../domain/repositories";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class UserStore implements UserRepository {
    factory;
    constructor(factory: any) {
        this.factory = factory;
    }

    async fetchAll(offset: number, limit: number, queryParams: Partial<User>): Promise<User[]> {
        const conditions = {
            OR: [
                { name: { contains: queryParams.name } },
                { email: { contains: queryParams.email } },
                { userName: { contains: queryParams.userName } },
            ],
        }
        const users = await prisma.user.findMany({
            skip: offset,
            take: limit,
            where: conditions
        });
        return this.factory.createEntities(users);
    }

    async fetchById(id: string): Promise<User> {
        const user = await prisma.user.findUnique({
            where: { id }
        });
        return this.factory.createEntity(user);
    }

    async fetchByEmail(email: string): Promise<User> {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        return this.factory.createEntity(user);
    }

    async fetchByUsername(userName: string): Promise<User> {
        const user = await prisma.user.findUnique({
            where: { userName }
        });
        return this.factory.createEntity(user);
    }

    async create(user: User): Promise<User> {
        const createdUser = await prisma.user.create({
            data: user
        });
        return this.factory.createEntity(createdUser);
    }

    async update(id: string, user: User): Promise<User> {
        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: user
        });
        return this.factory.createEntity(updatedUser);
    }

    async remove(id: string): Promise<User> {
        const deletedUser = await prisma.user.delete({
            where: { id: id }
        });
        return this.factory.createEntity(deletedUser);
    }
}