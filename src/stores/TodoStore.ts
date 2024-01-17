import { EntityFactory } from "domain/entityFactories";
import { Todo } from "../domain/entities";
import { TodoRepository } from "../domain/repositories";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class TodoStore implements TodoRepository {
    factory: EntityFactory<Todo>;
    constructor(factory: any){
        this.factory = factory;
    }

    async count(queryParams: Partial<Todo>): Promise<number> {
        const conditions = {
            OR: [
                { title: { contains: queryParams.title } },
                { description: { contains: queryParams.description } },
            ],
        }
        return await prisma.todo.count({
            where: conditions
        });
    }

    async fetchAll(offset: number, limit: number, queryParams: Partial<Todo>): Promise<Todo[]> {
        const conditions = {
            OR: [
                { title: { contains: queryParams.title } },
                { description: { contains: queryParams.description } },
            ],
        }
        const users = await prisma.todo.findMany({
            skip: offset,
            take: limit,
            where: conditions
        });
        return this.factory.createEntities(users);

    }

    async fetchById(id: string): Promise<Todo> {
        const user =  await prisma.todo.findUnique({
            where: { id }
        });
        return this.factory.createEntity(user);
    }

    async add(todo: Todo): Promise<Todo> {
        const user = await prisma.todo.create({
            data: todo
        });
        return this.factory.createEntity(user);
    }

    async update(id: string, todo: Todo): Promise<Todo> {
        const updateUser = await prisma.todo.update({
            where: { id },
            data: todo
        });
        return this.factory.createEntity(updateUser);
    }

    async remove(id: string): Promise<Todo> {
        const deletedUser = await prisma.todo.delete({
            where: { id }
        });
        return this.factory.createEntity(deletedUser);
    }
}