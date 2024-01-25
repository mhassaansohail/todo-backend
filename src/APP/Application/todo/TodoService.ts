import { inject, injectable } from "tsyringe";
import Todo from "../../Domain/entities/Todo";
import { TodoRepository } from "../../Domain/repositories/TodoRepository";
import { PaginatedCollection } from "../../Domain/pagination/PaginatedCollection";
import { Ok, Err } from "oxide.ts";
import { Logger } from "../../Infrastructure/logger/Logger";

@injectable()
export class TodoService {

    constructor(@inject("Logger") private logger: Logger, @inject("TodoRepository") private repository: TodoRepository) {
        this.logger = logger;
        this.repository = repository;
    }

    async getTodos(offset: number, limit: number, conditionParams: Partial<Todo>) {
        try {
            const totalTodoRows = await this.repository.count(conditionParams);
            const todoRows = await this.repository.fetchAll(offset, limit, conditionParams);
            return Ok(new PaginatedCollection(todoRows, totalTodoRows, offset, limit));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async getTodoById(todoId: string) {
        try {
            return Ok(await this.repository.fetchById(todoId));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async addTodo(todo: Todo) {
        try {
            const todoEntity = Todo.createByObject(todo)
            return Ok(await this.repository.add(todoEntity));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async updateTodo(todoId: string, todo: Todo) {
        try {
            const todoEntity = Todo.createByObject(todo)
            return Ok(await this.repository.update(todoId, todoEntity));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async deleteTodo(todoId: string) {
        try {
            return Ok(await this.repository.remove(todoId));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }
}
