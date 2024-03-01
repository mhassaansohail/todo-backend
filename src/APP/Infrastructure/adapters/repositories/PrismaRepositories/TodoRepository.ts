import { inject, injectable } from "tsyringe";
import Todo, { TodoAttributesSerialized } from "../../../../Domain/entities/TodoEntity";
import { TodoRepository } from "../../../../Domain/repositories/TodoRepository";
import { PrismaClient } from "@prisma/client";
import { Logger } from "../../../logger/Logger";
import { RepositoryResult, UUIDVo } from "@carbonteq/hexapp";
import { Result } from '@carbonteq/fp'
import { TodoNotFound } from "../../../../Domain/exceptions/todo/TodoNotFoundException";
import { TodoDTO } from "../dto/TodoDto";
import { DbMalfunction } from "../exceptions/db/DbMalfunctionException";

@injectable()
export class PrismaTodoRepository extends TodoRepository {
    private client: PrismaClient;
    private logger: Logger

    constructor(@inject("PrismaClient") client: PrismaClient, @inject("Logger") logger: Logger) {
        super();
        this.logger = logger;
        this.client = client;
    }

    async countTotalRows(conditionParams: Partial<TodoAttributesSerialized>): Promise<RepositoryResult<number>> {
        try {
            const conditions = {
                OR: [
                    { title: { contains: conditionParams.title } },
                    { description: { contains: conditionParams.description } },
                ],
            }
            return Result.Ok(await this.client.todo.count({
                where: conditions
            }));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new DbMalfunction("countTotalRows"));
        }
    }

    async fetchAllPaginated(offset: number, limit: number, queryParams: Partial<TodoAttributesSerialized>): Promise<RepositoryResult<Todo[]>> {
        try {
            const conditions = {
                OR: [
                    { title: { contains: queryParams.title } },
                    { description: { contains: queryParams.description } },
                ],
            }
            const fetchedTodos = await this.client.todo.findMany({
                skip: offset,
                take: limit,
                where: conditions
            });
            return Result.Ok(fetchedTodos.map((fetchedTodo: any) => Todo.fromObj(TodoDTO.toDomain(fetchedTodo))));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new DbMalfunction("fetchAllPaginated"));
        }

    }

    async existsById(todoId: UUIDVo): Promise<RepositoryResult<boolean>> {
        try {
            const todoExists = (await this.client.todo.findUnique({
                where: {
                    todoId: todoId.serialize()
                },
                select: {
                    todoId: true
                }
            }));
            return !!todoExists ? Result.Ok(!!todoExists) : Result.Err(new TodoNotFound(todoId.serialize()));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new DbMalfunction("existsById"));
        }
    }

    async fetchById(todoId: UUIDVo): Promise<RepositoryResult<Todo>> {
        try {
            const serializedTodoId: string = todoId.serialize();
            const fetchedTodo = await this.client.todo.findUnique({
                where: { todoId: serializedTodoId }
            });
            return fetchedTodo ? Result.Ok(Todo.fromObj(TodoDTO.toDomain(fetchedTodo))) : Result.Err(new TodoNotFound(todoId.serialize()));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new DbMalfunction("fetchById"));
        }
    }

    async insert(todo: Todo): Promise<RepositoryResult<Todo>> {
        try {
            const { Id: todoId, ...todoAttributes } = todo.serialize();
            const addedTodo = await this.client.todo.create({
                data: {
                    todoId,
                    ...todoAttributes
                }
            });
            return Result.Ok(Todo.fromObj(TodoDTO.toDomain(addedTodo)));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new DbMalfunction("insert"));
        }
    }

    async update(todo: Todo): Promise<RepositoryResult<Todo>> {
        try {
            const { Id: todoId, ...todoAttributes } = todo.serialize();
            const updateTodo = await this.client.todo.update({
                where: { todoId },
                data: todoAttributes
            });
            return Result.Ok(Todo.fromObj(TodoDTO.toDomain(updateTodo)));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new DbMalfunction("update"));
        }
    }

    async deleteById(todoId: UUIDVo): Promise<RepositoryResult<Todo>> {
        try {
            const serializedTodoId = todoId.serialize()
            const removedTodo = await this.client.todo.delete({
                where: { todoId: serializedTodoId }
            });
            return Result.Ok(Todo.fromObj(TodoDTO.toDomain(removedTodo)));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new DbMalfunction("deleteById"));
        }
    }
}