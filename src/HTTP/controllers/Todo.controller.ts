import { NextFunction, Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { Logger } from "../../APP/Infrastructure/logger/Logger";
import { TodoService } from "../../APP/Application/todo/Todo.service";
import { FetchTodoPaginationOptionsDto, TodoIdDto, AddTodoDto, UpdateTodoDto, TodoDto } from "../../APP/Application/DTO";

@injectable()
export class TodoController {
    private logger: Logger;
    private service: TodoService
    constructor(@inject("Logger") logger: Logger, @inject("TodoService") service: TodoService) {
        this.logger = logger;
        this.service = service;
    }

    getTodos = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
        try {
            const queryParamsValidation = FetchTodoPaginationOptionsDto.create(req.query);
            if (queryParamsValidation.isErr()) {
                const { message } = queryParamsValidation.unwrapErr();
                this.logger.error(message);
                return res.status(403).json({ status: "Unsuccesful", message });
            }
            const fetchTodosResult = await this.service.getTodos(queryParamsValidation.unwrap());
            if (fetchTodosResult.isErr()) {
                const { message } = fetchTodosResult.unwrapErr();
                this.logger.error(message);
                return res.status(400).json({ status: "Unsuccesful", message });
            }
            return res.status(200).json({ status: "Succesful", data: fetchTodosResult.unwrap() });
        } catch (error) {
            next(error);
        }
    }

    getTodoById = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
        try {
            const todoIdValidationResult = TodoIdDto.create(req.params);
            if (todoIdValidationResult.isErr()) {
                const { message } = todoIdValidationResult.unwrapErr();
                this.logger.error(message);
                return res.status(403).json({ status: "Unsuccesful", message });
            }
            const fetchedTodoResult = await this.service.getTodoById(todoIdValidationResult.unwrap());
            if (fetchedTodoResult.isErr()) {
                const { message } = fetchedTodoResult.unwrapErr();
                this.logger.error(message);
                return res.status(204).json({ status: "Unsuccesful", message });
            }
            const fetchedTodo = fetchedTodoResult.unwrap();
            return res.status(200).json({ status: "Succesful", data: TodoDto.toPresentation(fetchedTodo).unwrap() });
        } catch (error) {
            next(error);
        }
    }

    addTodo = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
        try {
            const todoInputValidationResult = AddTodoDto.create(req.body);
            if (todoInputValidationResult.isErr()) {
                const { message } = todoInputValidationResult.unwrapErr()
                this.logger.error(message);
                return res.status(403).json({ status: "Unsuccesful", message });
            }
            const addedTodoResult = await this.service.addTodo(todoInputValidationResult.unwrap());
            if (addedTodoResult.isErr()) {
                const { message } = addedTodoResult.unwrapErr();
                this.logger.error(message);
                return res.status(400).json({ status: "Unsuccesful", message });
            }
            const addedTodo = addedTodoResult.unwrap()
            return res.status(201).json({ status: "Succesful", data: TodoDto.toPresentation(addedTodo).unwrap() });
        } catch (error) {
            next(error);
        }
    }

    updateTodo = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
        try {
            const todoIdValidationResult = TodoIdDto.create(req.params);
            if (todoIdValidationResult.isErr()) {
                const { message } = todoIdValidationResult.unwrapErr();
                this.logger.error(message);
                return res.status(403).json({ status: "Unsuccesful", message });
            }
            const todoInputValidationResult = UpdateTodoDto.create({ todoId: todoIdValidationResult.unwrap(), ...req.body });
            if (todoInputValidationResult.isErr()) {
                const { message } = todoInputValidationResult.unwrapErr()
                this.logger.error(message);
                return res.status(403).json({ status: "Unsuccesful", message });
            }
            const updatedTodoResult = await this.service.updateTodo(todoInputValidationResult.unwrap());
            if (updatedTodoResult.isErr()) {
                const { message } = updatedTodoResult.unwrapErr();
                this.logger.error(message);
                return res.status(400).json({ status: "Unsuccesful", message });
            }
            const updatedTodo = updatedTodoResult.unwrap();
            return res.status(200).json({ status: "Succesful", data: TodoDto.toPresentation(updatedTodo).unwrap() });
        } catch (error) {
            next(error);
        }
    }

    deleteTodo = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
        try {
            const todoIdValidationResult = TodoIdDto.create(req.params);
            if (todoIdValidationResult.isErr()) {
                const { message } = todoIdValidationResult.unwrapErr();
                this.logger.error(message);
                return res.status(403).json({ status: "Unsuccesful", message });
            }
            const deletedTodoResult = await this.service.deleteTodo(todoIdValidationResult.unwrap());
            if (deletedTodoResult.isErr()) {
                const { message } = deletedTodoResult.unwrapErr();
                this.logger.error(message);
                return res.status(400).json({ status: "Unsuccesful", message });
            }
            const deletedTodo = deletedTodoResult.unwrap();
            return res.status(200).json({ status: "Succesful", data: TodoDto.toPresentation(deletedTodo).unwrap() });
        } catch (error) {
            next(error);
        }
    }
}