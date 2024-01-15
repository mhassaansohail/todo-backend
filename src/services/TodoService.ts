import { Todo } from "../types/Todo";
import { TodoRepository } from "../stores";
import { PaginatedCollection } from "../pagination";

export class TodoService {
    repository: TodoRepository;
    constructor(repoistory: TodoRepository) {
        this.repository = repoistory
    }

    async getPaginatedTodos(pageNumber: number, recordsPerPage: number, conditionParams: Partial<Todo>) {
        try {
            const totalRecords = await this.repository.count();
            const totalPages = totalRecords / recordsPerPage;
            if (totalPages <= 0) {
                throw new Error('Records requested exceed total records available.')
            }
            if (pageNumber > totalPages) {
                throw new Error('Page number requested exceeds total pages available.')
            }
            const offset = recordsPerPage * (pageNumber - 1);
            const todosAndCount = await this.repository.fetch(offset, recordsPerPage, conditionParams);
            const paginatedTodos: PaginatedCollection<Todo> = new PaginatedCollection(todosAndCount.models, todosAndCount.count, recordsPerPage, pageNumber, totalPages);
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
