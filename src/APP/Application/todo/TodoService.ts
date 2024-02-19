import { inject, injectable } from "tsyringe";
import Todo from "../../Domain/entities/Todo";
import { TodoRepository } from "../../Domain/repositories/TodoRepository";
import { PaginatedCollection } from "../../Domain/pagination/PaginatedCollection";
import { Ok, Err, Result } from "oxide.ts";
import { IUniqueIDGenerator } from "../ports/IUniqueIDGenerator";
import { PaginationOptions } from "../../Domain/pagination/PaginatedOptions";
import { TodoAttributes } from "APP/Domain/types/todo";


@injectable()
export class TodoService {
    private repository: TodoRepository;
    private idGenerator: IUniqueIDGenerator;
    constructor(@inject("UniqueIDGenerator") idGenerator: IUniqueIDGenerator, @inject("TodoRepository") repository: TodoRepository) {
        this.repository = repository;
        this.idGenerator = idGenerator;
    }

    async getTodos(pageNumber: number, pageSize: number, conditionParams: Partial<Todo>): Promise<Result<PaginatedCollection<Todo>, Error>> {
        try {
            const totalTodoRows = await this.repository.count(conditionParams);
            const paginationOptions: PaginationOptions = new PaginationOptions(pageSize, pageNumber);
            const todoRows = await this.repository.fetchAll(paginationOptions.offset, paginationOptions.limit, conditionParams);
            return Ok(new PaginatedCollection(todoRows, totalTodoRows, pageNumber, pageSize));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async getTodoById(todoId: string): Promise<Result<Todo, Error>> {
        try {
            return Ok(await this.repository.fetchById(todoId));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async addTodo(todo: TodoAttributes): Promise<Result<Todo, Error>> {
        try {
            const todoId = this.idGenerator.getUniqueID();
            todo.todoId = todoId;
            const todoEntity = Todo.createByObject({ ...todo })
            return Ok(await this.repository.add(todoEntity));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async updateTodo(todoId: string, todo: TodoAttributes): Promise<Result<Todo, Error>> {
        try {
            const todoEntity = Todo.createByObject(todo)
            return Ok(await this.repository.update(todoId, todoEntity));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async deleteTodo(todoId: string): Promise<Result<Todo, Error>> {
        try {
            return Ok(await this.repository.remove(todoId));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }
}
