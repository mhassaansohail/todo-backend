import { Todo, RowsAndCount } from "../types";
import { TodoRepository } from "./TodoRepository";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class TodoStore implements TodoRepository {

    async fetchAll(offset: number, limit: number, queryParams: Partial<Todo>): Promise<RowsAndCount<Todo>> {
        const conditions = {
            OR: [
                { title: { contains: queryParams.title } },
                { description: { contains: queryParams.description } },
            ],
        }
        const [count, rows] = await prisma.$transaction([
            prisma.todo.count({
                where: conditions
            }),
            prisma.todo.findMany({
                skip: offset,
                take: limit,
                where: conditions
            })
        ]);
        return {
            count,
            rows
        };
    }

    async fetchById(id: string): Promise<Todo | null> {
        try {
            return await prisma.todo.findUnique({
                where: { id }
            });
        } catch (error) {
            throw error;
        }
    }

    async add(todo: Todo): Promise<Todo> {
        try {
            return await prisma.todo.create({
                data: todo
            });
        } catch (error) {
            throw error;
        }
    }

    async update(id: string, todo: Todo): Promise<Todo> {
        try {
            return await prisma.todo.update({
                where: { id },
                data: todo
            });
        } catch (error) {
            throw error;
        }
    }

    async remove(id: string): Promise<Todo> {
        try {
            return await prisma.todo.delete({
                where: { id }
            });
        } catch (error) {
            throw error;
        }
    }
}