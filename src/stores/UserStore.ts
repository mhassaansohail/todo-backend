import { User, RowsAndCount } from "../types";
import { UserRepository } from "./UserRepository";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class UserStore implements UserRepository {

    async fetchAll(offset: number, limit: number, queryParams: Partial<User>): Promise<RowsAndCount<User>> {
        try {
            const conditions = {
                OR: [
                    { name: { contains: queryParams.name } },
                    { email: { contains: queryParams.email } },
                    { userName: { contains: queryParams.userName } },
                ],
            }
            const [count, rows] = await prisma.$transaction([
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
                rows
            }
        } catch (error) {
            throw error;
        }
    }

    async fetchById(id: string): Promise<User | null> {
        try {
            return await prisma.user.findUnique({
                where: { id }
            });
        } catch (error) {
            throw error;
        }
    }

    async fetchByEmail(email: string): Promise<User | null> {
        try {
            return await prisma.user.findUnique({
                where: { email }
            });
        } catch (error) {
            throw error;
        }
    }

    async fetchByUsername(userName: string): Promise<User | null> {
        try {
            return await prisma.user.findUnique({
                where: { userName }
            });
        } catch (error) {
            throw error;
        }
    }

    async create(user: User): Promise<User> {
        try {
            return await prisma.user.create({
                data: user
            });
        } catch (error) {
            throw error;
        }
    }

    async update(id: string, user: User): Promise<User> {
        try {
            return await prisma.user.update({
                where: { id: id },
                data: user
            });
        } catch (error) {
            throw error;
        }
    }

    async remove(id: string): Promise<User> {
        try {
            return await prisma.user.delete({
                where: { id: id }
            });
        } catch (error) {
            throw error;
        }
    }
}