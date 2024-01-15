import { User, ModelAndCount } from "../types";
import { UserRepository } from "./UserRepository";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class UserStore implements UserRepository {

    async count(): Promise<number> {
        return await prisma.user.count();
    }

    async fetch(offset: number, limit: number, queryParams: Partial<User>): Promise<ModelAndCount<User>> {
        try {
            const conditions = {
                OR: [
                    { name: { contains: queryParams.name } },
                    { email: { contains: queryParams.email } },
                    { userName: { contains: queryParams.userName } },
                ],
            }
            const [count, models] = await prisma.$transaction([
                prisma.user.count({
                    where: conditions
                }),
                prisma.user.findMany({
                    skip: offset,
                    take: limit,
                    where: conditions
                })
            ]);
            return {
                count,
                models
            }
        } catch (error) {
            throw error;
        }
    }

    async fetchById(id: string): Promise<User | null> {
        try {
            const user = await prisma.user.findUnique({
                where: { id: id }
            });
            return user;
        } catch (error) {
            throw error;
        }
    }

    async fetchByEmail(email: string): Promise<User | null> {
        try {
            const user = await prisma.user.findUnique({
                where: { email }
            });
            return user;
        } catch (error) {
            throw error;
        }
    }

    async fetchByUsername(userName: string): Promise<User | null> {
        try {
            const user = await prisma.user.findUnique({
                where: { userName }
            });
            return user;
        } catch (error) {
            throw error;
        }
    }

    async create(user: User): Promise<User> {
        try {
            const userCreation = await prisma.user.create({
                data: user
            });
            return userCreation;
        } catch (error) {
            throw error;
        }
    }

    async update(id: string, user: User): Promise<User> {
        try {
            const userUpdation = await prisma.user.update({
                where: { id: id },
                data: user
            });
            return userUpdation;
        } catch (error) {
            throw error;
        }
    }

    async remove(id: string): Promise<User> {
        try {
            const userDeletion = await prisma.user.delete({
                where: { id: id }
            });
            return userDeletion;
        } catch (error) {
            throw error;
        }
    }
}