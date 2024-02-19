import { inject, injectable } from "tsyringe";
import Todo from "../../../../Domain/entities/Todo";
import { TodoRepository } from "../../../../Domain/repositories/TodoRepository";
import { PrismaClient } from "@prisma/client";
import { Logger } from "../../../logger/Logger";

const prisma = new PrismaClient();

@injectable()
export class PrismaTodoRepository implements TodoRepository {
    constructor(@inject("Logger") private logger: Logger) {
        this.logger = logger;
    }

    async count(queryParams: Partial<Todo>): Promise<number> {
        try {
            const conditions = {
                OR: [
                    { title: { contains: queryParams.title } },
                    { description: { contains: queryParams.description } },
                ],
            }
            return await prisma.todo.count({
                where: conditions
            });
        } catch (error: any) {
            this.logger.error(error.message);
            throw new Error(error.message);
        }
    }

    async fetchAll(offset: number, limit: number, queryParams: Partial<Todo>): Promise<Todo[]> {
        try {
            const conditions = {
                OR: [
                    { title: { contains: queryParams.title } },
                    { description: { contains: queryParams.description } },
                ],
            }
            const fetchedTodos = await prisma.todo.findMany({
                skip: offset,
                take: limit,
                where: conditions
            });
            return fetchedTodos.map((fetchedTodo: Todo) => Todo.createByObject(fetchedTodo));
        } catch (error: any) {
            this.logger.error(error.message);
            throw new Error(error.message);
        }

    }

    async fetchById(todoId: string): Promise<Todo> {
        try {
            const fetchedTodo = await prisma.todo.findUnique({
                where: { todoId }
            });
            if (fetchedTodo !== null) {
                return Todo.createByObject(fetchedTodo);
            }
            throw new Error("Todo not found.");
        } catch (error: any) {
            this.logger.error(error.message);
            throw new Error(error.message);
        }
    }

    async add(todo: Todo): Promise<Todo> {
        try {
            const addedTodo = await prisma.todo.create({
                data: todo
            });
            return Todo.createByObject(addedTodo);
        } catch (error: any) {
            this.logger.error(error.message);
            throw new Error(error.message);
        }
    }

    async update(todoId: string, todo: Todo): Promise<Todo> {
        try {
            const { todoId: omittedTodoId, ...persistableTodo } = todo;
            const updateTodo = await prisma.todo.update({
                where: { todoId },
                data: persistableTodo
            });
            return Todo.createByObject(updateTodo);
        } catch (error: any) {
            this.logger.error(error.message);
            throw new Error(error.message);
        }
    }

    async remove(todoId: string): Promise<Todo> {
        try {
            const removedTodo = await prisma.todo.delete({
                where: { todoId }
            });
            return Todo.createByObject(removedTodo);
        } catch (error: any) {
            this.logger.error(error.message);
            throw new Error(error.message);
        }
    }
}