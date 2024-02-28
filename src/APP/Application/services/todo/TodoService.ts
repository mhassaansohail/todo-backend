import { inject, injectable } from "tsyringe";
import { AppResult, UUIDVo } from "@carbonteq/hexapp";
import { Result } from "@carbonteq/fp";
import { TodoDeletedEvent } from "./integrationEvents/todoDeleted/TodoDeletedEvent";
import { TodoRepository } from "../../../Domain/repositories/TodoRepository";
import { IEventManager } from "../../interfaces/IEventManager";
import { PaginatedCollection } from "../../../Domain/pagination/PaginatedCollection";
import { AddTodoDto, FetchTodoPaginationOptionsDto, TodoIdDto, UpdateTodoDto } from "../../dto";
import { PaginationOptions } from "../../../Domain/pagination/PaginatedOptions";
import Todo from "../../../Domain/entities/TodoEntity";
import { TodoNotFound } from "../../../Domain/exceptions/todo/TodoNotFoundException";


@injectable()
export class TodoService {
    private repository: TodoRepository;
    private eventManager: IEventManager;
    constructor(@inject("TodoRepository") repository: TodoRepository, @inject("EventManager") eventManager: IEventManager) {
        this.repository = repository;
        this.eventManager = eventManager;
    }

    async getTodos({ pageNumber, pageSize, title, description }: FetchTodoPaginationOptionsDto): Promise<AppResult<PaginatedCollection<Todo>>> {
        try {
            const conditionParams = { title, description }
            const totalTodoRows = (await this.repository.countTotalRows(conditionParams)).unwrap();
            const todoPaginationOptions: PaginationOptions = new PaginationOptions(pageSize, pageNumber);
            const todoRows = (await this.repository.fetchAllPaginated(todoPaginationOptions.offset, todoPaginationOptions.limit, conditionParams)).unwrap();
            return AppResult.fromResult(Result.Ok(new PaginatedCollection(todoRows, totalTodoRows, pageNumber, pageSize)));
        } catch (error: any) {
            return AppResult.fromResult(Result.Err(error));
        }
    }

    async getTodoById({ todoId }: TodoIdDto): Promise<AppResult<Todo>> {
        try {
            const todoIdVo = UUIDVo.fromStrNoValidation(todoId);
            return AppResult.fromResult(Result.Ok((await this.repository.fetchById(todoIdVo)).unwrap()));
        } catch (error: any) {
            return AppResult.fromResult(Result.Err(error));
        }
    }

    async addTodo(todo: AddTodoDto): Promise<AppResult<Todo>> {
        try {
            const todoEntity = Todo.create(todo.title, todo.description, todo.completed);
            return AppResult.fromResult(Result.Ok((await this.repository.insert(todoEntity)).unwrap()));
        } catch (error: any) {
            return AppResult.fromResult(Result.Err(error));
        }
    }

    async updateTodo(todo: UpdateTodoDto): Promise<AppResult<Todo>> {
        try {
            const toUpdateTodo = (await this.repository.fetchById(UUIDVo.fromStrNoValidation(todo.todoId))).unwrap();
            toUpdateTodo.update(todo);
            return AppResult.fromResult(Result.Ok((await this.repository.update(toUpdateTodo)).unwrap()));
        } catch (error: any) {
            return AppResult.fromResult(Result.Err(error));
        }
    }

    async deleteTodo({ todoId }: TodoIdDto): Promise<AppResult<Todo>> {
        try {
            const todoIdVo = UUIDVo.fromStrNoValidation(todoId);
            const todoExists = ((await this.repository.existsById(todoIdVo)).unwrap());
            if (!todoExists) {
                return AppResult.fromResult(Result.Err(new TodoNotFound(todoId)));
            }
            const deletedTodo = ((await this.repository.deleteById(todoIdVo)).unwrap());
            const todoDeletedEvent = new TodoDeletedEvent({ todoId });
            this.eventManager.emit("todoDeleted", todoDeletedEvent);
            return AppResult.fromResult(Result.Ok(deletedTodo));
        } catch (error: any) {
            return AppResult.fromResult(Result.Err(error));
        }
    }
}
