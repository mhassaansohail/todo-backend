import { Request, Response } from "express";
import { validateTodoIdParam, validateTodoInput, validateTodoPaginationOptions } from "./validators";
import { todoService } from "../services";
import { Result, Ok, Err, None, Option, match } from "oxide.ts";
import { PaginatedCollection } from "pagination";
import { NullTodo, Todo } from "../domain/entities";

export class TodoController {
    logger: any
    constructor(logger: any) {
        this.logger = logger;
    }

    getTodos = async (req: Request, res: Response): Promise<Response> => {
        const queryParamsValidation = validateTodoPaginationOptions(req.query);
        const validationResult = match(queryParamsValidation, {
            Ok: (searchParams) => searchParams,
            Err: (error) => error
        });
        if (validationResult instanceof Error) {
            this.logger.error(validationResult.message);
            return res.status(500).json({ message: validationResult.message });
        }
        const { offset, limit, title, description } = validationResult;
        const conditionParams = { title, description };
        const fetchedTodos = await todoService.getTodos(offset, limit, conditionParams);
        const fetchTodosResult = match(fetchedTodos, {
            Ok: (paginatedCollection: PaginatedCollection<Todo>) => paginatedCollection,
            Err: (error: any) => error,
        });
        if (fetchTodosResult instanceof Error) {
            this.logger.error(fetchTodosResult.message);
            return res.status(500).json({ message: fetchTodosResult.message });
        }
        return res.status(200).json({ message: `Users found.`, data: fetchTodosResult });
    }

    getTodoById = async (req: Request, res: Response): Promise<Response> => {
        const todoIdValidation = validateTodoIdParam(req.params);
        const todoIdvalidationResult = match(todoIdValidation, {
            Ok: (idParam) => idParam,
            Err: (error) => error
        });
        if (todoIdvalidationResult instanceof Error) {
            this.logger.error(todoIdvalidationResult.message);
            return res.status(500).json({ message: todoIdvalidationResult.message });
        }
        const { todoId } = todoIdvalidationResult;
        const fetchedTodo = await todoService.getTodoById(todoId);
        const fetchedTodoResult = match(fetchedTodo, {
            Ok: (todo: any) => todo,
            Err: (error: Error) => error,
        });
        if (fetchedTodoResult instanceof Error) {
            this.logger.error(fetchedTodoResult.message);
            return res.status(500).json({ message: fetchedTodoResult.message });
        } else if (fetchedTodoResult instanceof NullTodo) {
            return res.status(204).end();
        }
        return res.status(200).json({ message: `Todo with id: ${todoId} found.`, data: fetchedTodoResult });
    }

    createTodo = async (req: Request, res: Response): Promise<Response> => {
        const todoInputValidation = validateTodoInput(req.body);
        const todoinputValidationResult = match(todoInputValidation, {
            Ok: (todoInput: any) => todoInput,
            Err: (error: Error) => error
        });
        if (todoinputValidationResult instanceof Error) {
            this.logger.error(todoinputValidationResult.message);
            return res.status(500).json({ message: todoinputValidationResult.message });
        }
        const createdTodo = await todoService.createTodo(todoinputValidationResult);
        const createdTodoResult = match(createdTodo, {
            Ok: (todo) => todo,
            Err: (error: Error) => error
        });
        if (createdTodoResult instanceof Error) {
            this.logger.error(createdTodoResult.message);
            return res.status(500).json({ message: createdTodoResult.message });
        }
        return res.status(201).json({ message: `Todo created.`, data: createdTodoResult });
    }

    updateTodo = async (req: Request, res: Response): Promise<Response> => {
        const todoIdValidation = validateTodoIdParam(req.params);
        const todoIdValidationResult = match(todoIdValidation, {
            Ok: (todoId) => todoId,
            Err: (error: Error) => error
        });
        if (todoIdValidationResult instanceof Error) {
            this.logger.error(todoIdValidationResult.message);
            return res.status(500).json({ message: todoIdValidationResult.message });
        }
        const { todoId } = todoIdValidationResult;
        const todoInputValidation = validateTodoInput(req.body);
        const todoInputValidationResult = match(todoInputValidation, {
            Ok: (todoInput: any) => todoInput,
            Err: (error: Error) => error
        });
        if (todoInputValidationResult instanceof Error) {
            this.logger.error(todoInputValidationResult.message);
            return res.status(500).json({ message: todoInputValidationResult.message });
        }
        const updatedTodo = await todoService.updateTodo(todoId, { id: todoId, ...todoInputValidationResult });
        const updatedTodoResult = match(updatedTodo, {
            Ok: (todo) => todo,
            Err: (error: Error) => error
        });
        if (updatedTodoResult instanceof Error) {
            this.logger.error(updatedTodoResult.message);
            return res.status(500).json({ message: updatedTodoResult.message });
        }
        return res.status(200).json({ message: `Todo with id: ${todoId} updated.`, data: updatedTodo });
    }

    deleteTodo = async (req: Request, res: Response): Promise<Response> => {
        const todoIdValidation = validateTodoIdParam(req.params);
        const todoIdValidationResult = match(todoIdValidation, {
            Ok: (todoId) => todoId,
            Err: (error: Error) => error
        });
        if (todoIdValidationResult instanceof Error) {
            this.logger.error(todoIdValidationResult.message);
            return res.status(500).json({ message: todoIdValidationResult.message });
        }
        const { todoId } = todoIdValidationResult;
        const deletedTodo = await todoService.deleteTodo(todoId);
        const deletedTodoResult = match(deletedTodo, {
            Ok: (todo: any) => todo,
            Err: (error: Error) => error,
        });
        if (deletedTodoResult instanceof Error) {
            this.logger.error(deletedTodoResult.message);
            return res.status(500).json({ message: deletedTodoResult.message });
        }
        return res.status(200).json({ message: `Todo with id: ${todoId} found.`, data: deletedTodoResult });
    }
}