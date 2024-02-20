import { inject, injectable } from "tsyringe";
import Todo from "../../../../Domain/entities/Todo";
import { TodoRepository } from "../../../../Domain/repositories/TodoRepository";
import { PrismaClient } from "@prisma/client";
import { Logger } from "../../../logger/Logger";
import { TodoAttributes } from "APP/Domain/attributes/todo";
import { RepositoryResult, UUIDVo } from "@carbonteq/hexapp";
import { Result } from '@carbonteq/fp'
import { InvalidOperationOnTodo, TodoNotFound } from "../exceptions/todo/TodoNotFound.exception";
import { TodoDTO } from "../DTO/todo.dto";

const prisma = new PrismaClient();

@injectable()
export class PrismaTodoRepository extends TodoRepository {
    constructor(@inject("Logger") private logger: Logger) {
        super();
        this.logger = logger;
    }

    async countTotalRows(conditionParams: Partial<TodoAttributes>): Promise<RepositoryResult<number>> {
        try {
            const conditions = {
                OR: [
                    { title: { contains: conditionParams.title } },
                    { description: { contains: conditionParams.description } },
                ],
            }
            return Result.Ok(await prisma.todo.count({
                where: conditions
            }));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new InvalidOperationOnTodo());
        }
    }

    async fetchAllPaginated(offset: number, limit: number, queryParams: Partial<Todo>): Promise<RepositoryResult<Todo[]>> {
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
            return Result.Ok(fetchedTodos.map((fetchedTodo) => Todo.fromObj(TodoDTO.toDomain(fetchedTodo))));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new InvalidOperationOnTodo());
        }

    }

    async fetchById(todoId: UUIDVo): Promise<RepositoryResult<Todo>> {
        try {
            const serializedTodoId: string = todoId.serialize();
            const fetchedTodo = await prisma.todo.findUnique({
                where: { todoId: serializedTodoId }
            });
            if (fetchedTodo !== null) {
                return Result.Ok(Todo.fromObj(TodoDTO.toDomain(fetchedTodo)))
            }
            return Result.Err(new TodoNotFound(todoId.serialize()));
        } catch (error: any) {
            this.logger.error(error.message);
            throw new Error(error.message);
        }
    }

    async insert(todo: Todo): Promise<RepositoryResult<Todo>> {
        try {
            const addedTodo = await prisma.todo.create({
                data: todo.serialize()
            });
            return Result.Ok(Todo.fromObj(TodoDTO.toDomain(addedTodo)));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new InvalidOperationOnTodo());
        }
    }

    async update(todo: Todo): Promise<RepositoryResult<Todo>> {
        try {
            const todoId = todo.Id.serialize();
            const updateTodo = await prisma.todo.update({
                where: { todoId },
                data: todo
            });
            return Result.Ok(Todo.fromObj(TodoDTO.toDomain(updateTodo)));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new TodoNotFound(todo.Id.serialize()));
        }
    }

    async deleteById(todoId: UUIDVo): Promise<RepositoryResult<Todo>> {
        try {
            const serializedTodoId = todoId.serialize()
            const removedTodo = await prisma.todo.delete({
                where: { todoId: serializedTodoId }
            });
            return Result.Ok(Todo.fromObj(TodoDTO.toDomain(removedTodo)));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new TodoNotFound(todoId.serialize()));
        }
    }
}