import { Todo } from "../domain/entities";
import { PaginatedCollection } from "../pagination";
import { Result, Ok, Err } from "oxide.ts";

export class TodoService {
    repository: any;
    constructor(repoistory: any) {
        this.repository = repoistory
    }

    async getTodos(offset: number, limit: number, conditionParams: Partial<Todo>) {
        try {
            const totalTodoRows = await this.repository.count(conditionParams);
            const todoRows = await this.repository.fetchAll(offset, limit, conditionParams);
            return Result(new PaginatedCollection(todoRows, totalTodoRows, offset, limit));
        } catch (error) {
            return Err(error);
        }
    }

    async getTodoById(todoId: string) {
        try {
            return Result(await this.repository.fetchById(todoId));
        } catch (error) {
            return Err(error);
        }
    }

    async createTodo(todo: Todo) {
        try {
            return Result(await this.repository.add(todo));
        } catch (error) {
            return Err(error);
        }
    }

    async updateTodo(todoId: string, todo: Todo) {
        try {
            const todoExists = await this.repository.fetchById(todoId);
            if (!todoExists) {
                return Err(new Error(`Todo with id: ${todoId} does not exist.`));
            }
            return Result(await this.repository.update(todoId, todo));
        } catch (error) {
            return Err(error);
        }
    }

    async deleteTodo(todoId: string) {
        try {
            const todoExists = await this.repository.fetchById(todoId);
            if (!todoExists) {
                return Err(new Error(`Todo with id: ${todoId} does not exist.`));
            }
            return Result(await this.repository.remove(todoId));
        } catch (error) {
            return Err(error);
        }
    }
}
