import { Todo, ModelAndCount } from "../types";
import { TodoRepository } from "./TodoRepository";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class TodoStore implements TodoRepository {

    async count(): Promise<number> {
        return await prisma.user.count();
    }

    async fetch(offset: number, limit: number, queryParams: Partial<Todo>): Promise<ModelAndCount<Todo>> {
        const conditions = {
            OR: [
                { title: { contains: queryParams.title } },
                { description: { contains: queryParams.description } },
            ],
        }
        const [count, models] = await prisma.$transaction([
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
            models
        }
    }

    async fetchById(id: string): Promise<Todo | null> {
        try {
            const todo = await prisma.todo.findUnique({
                where: { id: id }
            });
            return todo;
        } catch (error) {
            throw error;
        }
    }

    async create(todo: Todo): Promise<Todo> {
        try {
            const todoCreation = await prisma.todo.create({
                data: todo
            });
            return todoCreation;
        } catch (error) {
            throw error;
        }
    }

    async update(id: string, todo: Todo): Promise<Todo> {
        try {
            const todoUpdation = await prisma.todo.update({
                where: { id: id },
                data: todo
            });
            return todoUpdation;
        } catch (error) {
            throw error;
        }
    }

    async remove(id: string): Promise<Todo> {
        try {
            const todoDeletion = await prisma.todo.delete({
                where: { id: id }
            });
            return todoDeletion;
        } catch (error) {
            throw error;
        }
    }
}