import { inject, injectable } from "tsyringe";
import Todo from "../../Domain/entities/Todo";
import { TodoRepository } from "../../Domain/repositories/TodoRepository";
import { PaginatedCollection } from "../../Domain/pagination/PaginatedCollection";
import { Ok, Err } from "oxide.ts";
import { IUniqueIDGenerator } from "../contracts/IUniqueIDGenerator";


@injectable()
export class TodoService {
    private repository: TodoRepository;
    private idGenerator: IUniqueIDGenerator;
    constructor(@inject("UniqueIDGenerator") idGenerator: IUniqueIDGenerator, @inject("TodoRepository") repository: TodoRepository) {
        this.repository = repository;
        this.idGenerator = idGenerator;
    }

    async getTodos(offset: number, limit: number, conditionParams: Partial<Todo>): Promise<Ok<PaginatedCollection<Todo>> | Err<Error>> {
        try {
            const totalTodoRows = await this.repository.count(conditionParams);
            const todoRows = await this.repository.fetchAll(offset, limit, conditionParams);
            return Ok(new PaginatedCollection(todoRows, totalTodoRows, offset, limit));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async getTodoById(todoId: string): Promise<Ok<Todo> | Err<Error>> {
        try {
            return Ok(await this.repository.fetchById(todoId));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async addTodo(todo: Todo): Promise<Ok<Todo> | Err<Error>> {
        try {
            const todoId = this.idGenerator.getUniqueID();
            todo.todoId = todoId;
            const todoEntity = Todo.createByObject({ ...todo })
            return Ok(await this.repository.add(todoEntity));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async updateTodo(todoId: string, todo: Todo): Promise<Ok<Todo> | Err<Error>> {
        try {
            const todoEntity = Todo.createByObject(todo)
            return Ok(await this.repository.update(todoId, todoEntity));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async deleteTodo(todoId: string): Promise<Ok<Todo> | Err<Error>> {
        try {
            return Ok(await this.repository.remove(todoId));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }
}
