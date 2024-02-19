import { Request, Response } from "express";
import { validateTodoIdParam, validateTodoInput, validateTodoPaginationOptions } from "./inputValidators";
import { injectable, inject } from "tsyringe";
import { Logger } from "../../APP/Infrastructure/logger/Logger";
import { TodoAttributes } from "../../APP/Domain/types/todo";
import { TodoService } from "../../APP/Application/todo/TodoService";
import { TodoDTO } from "../DTO/todo.dto";

@injectable()
export class TodoController {
    private logger: Logger;
    private service: TodoService
    constructor(@inject("Logger") logger: Logger, @inject("TodoService") service: TodoService) {
        this.logger = logger;
        this.service = service;
    }

    getTodos = async (req: Request, res: Response): Promise<Response> => {
        const queryParamsValidation = validateTodoPaginationOptions(req.query);
        if (queryParamsValidation.isErr()) {
            const { message } = queryParamsValidation.unwrapErr();
            this.logger.error(message);
            return res.status(403).json({ status: "Unsuccesful", message });
        }
        const { pageSize, pageNumber, title, description } = queryParamsValidation.unwrap();
        const fetchTodosResult = await this.service.getTodos(pageNumber, pageSize, { title, description });
        if (fetchTodosResult.isErr()) {
            const { message } = fetchTodosResult.unwrapErr();
            this.logger.error(message);
            return res.status(400).json({ status: "Unsuccesful", message });
        }
        return res.status(200).json({ status: "Succesful", data: fetchTodosResult.unwrap() });
    }

    getTodoById = async (req: Request, res: Response): Promise<Response> => {
        const todoIdValidationResult = validateTodoIdParam(req.params);
        if (todoIdValidationResult.isErr()) {
            const { message } = todoIdValidationResult.unwrapErr();
            this.logger.error(message);
            return res.status(403).json({ status: "Unsuccesful", message });
        }
        const { todoId } = todoIdValidationResult.unwrap();
        const fetchedTodoResult = await this.service.getTodoById(todoId);
        if (fetchedTodoResult.isErr()) {
            const { message } = fetchedTodoResult.unwrapErr();
            this.logger.error(message);
            return res.status(204).json({ status: "Unsuccesful", message });
        }
        const fetchedTodo = fetchedTodoResult.unwrap();
        return res.status(200).json({ status: "Succesful", data: TodoDTO.toPresentation(fetchedTodo) });
    }

    addTodo = async (req: Request, res: Response): Promise<Response> => {
        const todoInputValidationResult = validateTodoInput(req.body);

        if (todoInputValidationResult.isErr()) {
            const { message } = todoInputValidationResult.unwrapErr()
            this.logger.error(message);
            return res.status(403).json({ status: "Unsuccesful", message });
        }
        const todoInput = todoInputValidationResult.unwrap();
        const createdTodoResult = await this.service.addTodo(todoInput as TodoAttributes);
        if (createdTodoResult.isErr()) {
            const { message } = createdTodoResult.unwrapErr();
            this.logger.error(message);
            return res.status(400).json({ status: "Unsuccesful", message });
        }
        const createdTodo = createdTodoResult.unwrap();
        return res.status(201).json({ status: "Succesful", data: TodoDTO.toPresentation(createdTodo) });
    }

    updateTodo = async (req: Request, res: Response): Promise<Response> => {
        const todoIdValidationResult = validateTodoIdParam(req.params);
        if (todoIdValidationResult.isErr()) {
            const { message } = todoIdValidationResult.unwrapErr();
            this.logger.error(message);
            return res.status(403).json({ status: "Unsuccesful", message });
        }
        const { todoId } = todoIdValidationResult.unwrap();
        const todoInputValidationResult = validateTodoInput(req.body);
        const isValidationError = todoInputValidationResult.isErr();
        if (isValidationError) {
            const { message } = todoInputValidationResult.unwrapErr()
            this.logger.error(message);
            return res.status(403).json({ status: "Unsuccesful", message });
        }
        const todoInput = todoInputValidationResult.unwrap();
        const updatedTodoResult = await this.service.updateTodo(todoId, { todoId, ...todoInput });
        if (updatedTodoResult.isErr()) {
            const { message } = updatedTodoResult.unwrapErr();
            this.logger.error(message);
            return res.status(400).json({ status: "Unsuccesful", message });
        }
        return res.status(200).json({ status: "Succesful", data: TodoDTO.toPresentation(updatedTodoResult.unwrap()) });
    }

    deleteTodo = async (req: Request, res: Response): Promise<Response> => {
        const todoIdValidationResult = validateTodoIdParam(req.params);
        if (todoIdValidationResult.isErr()) {
            const { message } = todoIdValidationResult.unwrapErr();
            this.logger.error(message);
            return res.status(403).json({ status: "Unsuccesful", message });
        }
        const { todoId } = todoIdValidationResult.unwrap();
        const deletedTodoResult = await this.service.deleteTodo(todoId);
        if (deletedTodoResult.isErr()) {
            const { message } = deletedTodoResult.unwrapErr();
            this.logger.error(message);
            return res.status(400).json({ status: "Unsuccesful", message });
        }
        return res.status(200).json({ status: "Succesful", data: TodoDTO.toPresentation(deletedTodoResult.unwrap()) });
    }
}