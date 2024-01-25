import { Request, Response } from "express";
import { validateTodoIdParam, validateTodoInput, validateTodoPaginationOptions } from "./validators";
import { todoService } from "../../APP/Infrastructure/IoC/container";
import { injectable, inject } from "tsyringe";
import { Logger } from "../../APP/Infrastructure/logger/Logger";
import { TodoAttributes } from "../../APP/Domain/types/todo";
import { CommandBus } from "../../APP/Application/utils/CommandBus";
import { AddTodoCommand } from "../../APP/Domain/commands/todo/AddTodoCommand";
import { TodoCommandHandler } from "../../APP/Application/todo/TodoCommandHandler";
import { UpdateTodoCommand } from "APP/Domain/commands/todo/UpdateTodoCommand";

@injectable()
export class TodoController {
    constructor(@inject("Logger") private logger: Logger, @inject("CommandBus") private commandBus: CommandBus) {
        this.logger = logger;
    }

    getTodos = async (req: Request, res: Response): Promise<Response> => {
        const queryParamsValidation = validateTodoPaginationOptions(req.query);
        if (queryParamsValidation.isErr()) {
            const { message } = queryParamsValidation.unwrapErr();
            this.logger.error(message);
            return res.status(403).json({ status: "Unsuccesful", message });
        }
        const { offset, limit, title, description } = queryParamsValidation.unwrap();
        const fetchTodosResult = await todoService.getTodos(offset, limit, { title, description });
        if (fetchTodosResult.isErr()) {
            const { message } = fetchTodosResult.unwrapErr();
            this.logger.error(message);
            return res.status(400).json({ status: "Unsuccesful", message });
        }
        return res.status(200).json({ status: "Unsuccesful", data: fetchTodosResult });
    }

    getTodoById = async (req: Request, res: Response): Promise<Response> => {
        const todoIdValidationResult = validateTodoIdParam(req.params);
        if (todoIdValidationResult.isErr()) {
            const { message } = todoIdValidationResult.unwrapErr();
            this.logger.error(message);
            return res.status(403).json({ status: "Unsuccesful", message });
        }
        const { todoId } = todoIdValidationResult.unwrap();
        const fetchedTodoResult = await todoService.getTodoById(todoId);
        if (fetchedTodoResult.isErr()) {
            const { message } = fetchedTodoResult.unwrapErr();
            this.logger.error(message);
            return res.status(204).json({ status: "Unsuccesful", message });
        }
        const fetchedTodo = fetchedTodoResult.unwrap();
        return res.status(200).json({ status: "Succesful", data: fetchedTodo });
    }

    addTodo = async (req: Request, res: Response): Promise<Response> => {
        const todoInputValidationResult = validateTodoInput(req.body);

        if (todoInputValidationResult.isErr()) {
            const { message } = todoInputValidationResult.unwrapErr()
            this.logger.error(message);
            return res.status(403).json({ status: "Unsuccesful", message });
        }
        const todoInput = todoInputValidationResult.unwrap();
        const addTodoCommmand = new AddTodoCommand(todoInput as TodoAttributes);
        // this.commandBus.registerHandler(AddTodoCommand.name, this.todoCommandHandler);
        const createdTodoResult = this.commandBus.dispatch(addTodoCommmand);
        if (createdTodoResult.isErr()) {
            const { message } = createdTodoResult.unwrapErr();
            this.logger.error(message);
            return res.status(400).json({ status: "Unsuccesful", message });
        }
        const createdTodo = createdTodoResult.unwrap();
        return res.status(201).json({ status: "Succesful", data: createdTodo });
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
        const updateTodoCommmand = new UpdateTodoCommand(todoInput as TodoAttributes);
        this.commandBus.dispatch(updateTodoCommmand);
        const updatedTodoResult = await todoService.updateTodo(todoId, { todoId, ...todoInput });
        if (updatedTodoResult.isErr()) {
            const { message } = updatedTodoResult.unwrapErr();
            this.logger.error(message);
            return res.status(400).json({ status: "Unsuccesful", message });
        }
        const updatedTodo = updatedTodoResult.unwrap();
        return res.status(200).json({ status: "Unsuccesful", data: updatedTodo });
    }

    deleteTodo = async (req: Request, res: Response): Promise<Response> => {
        const todoIdValidationResult = validateTodoIdParam(req.params);
        if (todoIdValidationResult.isErr()) {
            const { message } = todoIdValidationResult.unwrapErr();
            this.logger.error(message);
            return res.status(403).json({ status: "Unsuccesful", message });
        }
        const { todoId } = todoIdValidationResult.unwrap();
        const deletedTodoResult = await todoService.deleteTodo(todoId);
        if (deletedTodoResult.isErr()) {
            const { message } = deletedTodoResult.unwrapErr();
            this.logger.error(message);
            return res.status(400).json({ status: "Unsuccesful", message });
        }
        const deletedTodo = deletedTodoResult.unwrap();
        return res.status(200).json({ status: "Unsuccesful", data: deletedTodo });
    }
}