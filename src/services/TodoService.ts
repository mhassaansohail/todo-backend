import { Todo } from "../types";
import { TodoRepository } from "../stores";
import { PaginatedCollection } from "../pagination";

export class TodoService {
    repository: TodoRepository;
    constructor(repoistory: TodoRepository) {
        this.repository = repoistory
    }

    async getTodos(offset: number, limit: number, conditionParams: Partial<Todo>) {
        try {
            const todoRowsAndCount = await this.repository.fetchAll(offset, limit, conditionParams);
            return new PaginatedCollection(todoRowsAndCount.rows, todoRowsAndCount.count, offset, limit);
        } catch (error) {
            throw error;
        }
    }

    async getTodoById(todoId: string) {
        try {
            return await this.repository.fetchById(todoId);
        } catch (error) {
            throw error;
        }
    }

    async createTodo(todo: Todo) {
        try {
            return await this.repository.add(todo);
        } catch (error) {
            throw error;
        }
    }

    async updateTodo(todoId: string, todo: Todo) {
        try {
            const todoExists = await this.repository.fetchById(todoId);
            if (!todoExists) {
                throw new Error(`Todo with id: ${todoId} does not exist.`);
            }
            return await this.repository.update(todoId, todo);
        } catch (error) {
            throw error;
        }
    }

    async deleteTodo(todoId: string) {
        try {
            const todoExists = await this.repository.fetchById(todoId);
            if (!todoExists) {
                throw new Error(`Todo with id: ${todoId} does not exist.`);
            }
            return await this.repository.remove(todoId);
        } catch (error) {
            throw error;
        }
    }
}
