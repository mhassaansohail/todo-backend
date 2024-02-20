import { inject, injectable } from "tsyringe";
import { UUIDVo } from "@carbonteq/hexapp";
import { Result } from "@carbonteq/fp";
import Todo from "../../Domain/entities/Todo";
import { TodoRepository } from "../../Domain/repositories/TodoRepository";
import { PaginatedCollection } from "../../Domain/pagination/PaginatedCollection";
import { PaginationOptions } from "../../Domain/pagination/PaginatedOptions";
import { IFetchPaginatedTodo } from "./DTO/IFetchPaginatedTodo.dto";
import { IFetchTodoById } from "./DTO/IFetchTodoById.dto";
import { ICreateTodo } from "./DTO/ICreateTodo.dto";
import { IUpdateTodo } from "./DTO/IUpdateTodo.dto";
import { UpdateTodoDTO } from "./DTO/UpdateTodo.dto";
import { IDeleteTodoById } from "./DTO/IDeleteTodoById.dto";


@injectable()
export class TodoService {
    private repository: TodoRepository;
    constructor(@inject("TodoRepository") repository: TodoRepository) {
        this.repository = repository;
    }

    async getTodos({ pageNumber, pageSize, conditionParams }: IFetchPaginatedTodo): Promise<Result<PaginatedCollection<Todo>, Error>> {
        try {
            const totalTodoRows = (await this.repository.countTotalRows(conditionParams)).unwrap();
            const todoPaginationOptions: PaginationOptions = new PaginationOptions(pageSize, pageNumber);
            const todoRows = (await this.repository.fetchAllPaginated(todoPaginationOptions.offset, todoPaginationOptions.limit, conditionParams)).unwrap();
            return Result.Ok(new PaginatedCollection(todoRows, totalTodoRows, pageNumber, pageSize));
        } catch (error: any) {
            return Result.Err(new Error(error.message));
        }
    }

    async getTodoById({ todoId }: IFetchTodoById): Promise<Result<Todo, Error>> {
        try {
            const todoIdVo = UUIDVo.fromStrNoValidation(todoId);
            return Result.Ok((await this.repository.fetchById(todoIdVo)).unwrap());
        } catch (error: any) {
            return Result.Err(new Error(error.message));
        }
    }

    async addTodo(todo: ICreateTodo): Promise<Result<Todo, Error>> {
        try {
            const todoEntity = Todo.create(todo.title, todo.description, todo.completed);
            return Result.Ok((await this.repository.insert(todoEntity)).unwrap());
        } catch (error: any) {
            return Result.Err(new Error(error.message));
        }
    }

    async updateTodo(todo: IUpdateTodo): Promise<Result<Todo, Error>> {
        try {
            const toUpdateTodo = (await this.repository.fetchById(UUIDVo.fromStrNoValidation(todo.todoId))).unwrap();
            toUpdateTodo.update(todo);
            return Result.Ok((await this.repository.update(toUpdateTodo)).unwrap());
        } catch (error: any) {
            return Result.Err(error);
        }
    }

    async deleteTodo({ todoId }: IDeleteTodoById): Promise<Result<Todo, Error>> {
        try {
            const todoIdVo = UUIDVo.fromStrNoValidation(todoId);
            return Result.Ok((await this.repository.deleteById(todoIdVo)).unwrap());
        } catch (error: any) {
            return Result.Err(new Error(error.message));
        }
    }
}
