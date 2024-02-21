import { inject, injectable } from "tsyringe";
import Todo from "../../../../Domain/entities/Todo";
import { TodoRepository } from "../../../../Domain/repositories/TodoRepository";
import { PrismaClient } from "@prisma/client";
import { Logger } from "../../../logger/Logger";
import { TodoAttributes } from "APP/Domain/attributes/todo";
import { RepositoryResult, UUIDVo } from "@carbonteq/hexapp";
import { Result } from '@carbonteq/fp'
import { TodoNotFound } from "../../../../Domain/exceptions/todo/TodoNotFound.exception";
import { TodoDTO } from "../DTO/todo.dto";
import { DbMalfunction } from "../exceptions/shared/DbMalfunction.exception";

@injectable()
export class PrismaTodoRepository extends TodoRepository {
    private prisma;
    private logger: Logger

    constructor(prisma: any, @inject("Logger") logger: Logger) {
        super();
        this.logger = logger;
        this.prisma = prisma || new PrismaClient();
    }

    async countTotalRows(conditionParams: Partial<TodoAttributes>): Promise<RepositoryResult<number>> {
        try {
            const conditions = {
                OR: [
                    { title: { contains: conditionParams.title } },
                    { description: { contains: conditionParams.description } },
                ],
            }
            return Result.Ok(await this.prisma.todo.count({
                where: conditions
            }));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new DbMalfunction("countTotalRows"));
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
            const fetchedTodos = await this.prisma.todo.findMany({
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

    async fetchById(todoId: UUIDVo): Promise<RepositoryResult<Todo>> {
        try {
            const serializedTodoId: string = todoId.serialize();
            const fetchedTodo = await this.prisma.todo.findUnique({
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
            const addedTodo = await this.prisma.todo.create({
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
            const updateTodo = await this.prisma.todo.update({
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
            const removedTodo = await this.prisma.todo.delete({
                where: { todoId: serializedTodoId }
            });
            return Result.Ok(Todo.fromObj(TodoDTO.toDomain(removedTodo)));
        } catch (error: any) {
            this.logger.error(error.message);
            return Result.Err(new DbMalfunction("deleteById"));
        }
    }
}