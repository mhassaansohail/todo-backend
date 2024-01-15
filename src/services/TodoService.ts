import { Todo } from "../types/Todo";
import { TodoRepository } from "../stores";
import { PaginatedCollection } from "../pagination";

export class TodoService {
    repository: TodoRepository;
    constructor(repoistory: TodoRepository) {
        this.repository = repoistory
    }

    async getPaginatedTodos(offset: number, pageSize: number, conditionParams: Partial<Todo>) {
        try {
            const pageNumber = Math.floor(offset / pageSize) + 1;
            const todosAndCount = await this.repository.fetch(offset, pageSize, conditionParams);
            const paginatedTodos = new PaginatedCollection(todosAndCount.models, todosAndCount.count, pageSize, pageNumber);
            return paginatedTodos;
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
            return await this.repository.create(todo);
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
