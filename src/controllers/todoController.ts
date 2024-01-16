import { Request, Response } from "express";
import { v4 as uuid } from 'uuid';
import { todoIdParamSchema, todoParamsSchema, todoInputSchema, todoPaginationOptionsInputSchema } from "./validators";
import { todoService } from "../services";

export class TodoController {

    static getTodos = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { offset, limit, title, description } = todoPaginationOptionsInputSchema.parse(req.query);
            const conditionParams = { title, description }
            const users = await todoService.getTodos(offset, limit, conditionParams);
            if (users.rowsInCurrentPage === 0) {
                return res.status(204).json({ message: `No users found.`, data: users });
            }
            return res.status(200).json({ message: `Users found.`, data: users });
        } catch (error) {
            return res.status(500).json({ message: `Could not fetch users.` });
        }
    }

    static getTodoById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { todoId } = todoIdParamSchema.parse(req.params);
            const todo = await todoService.getTodoById(todoId);
            if (!todo) {
                return res.status(204).json({ message: `No todo with id: ${todoId} found.`, data: null });
            } else {
                return res.status(200).json({ message: `Todo with id: ${todoId} found.`, data: todo });
            }
        } catch (error) {
            return res.status(500).json({ message: `Could not fetch todo` });
        }
    }

    static createTodo = async (req: Request, res: Response): Promise<Response> => {
        try {
            const todo = todoInputSchema.parse(req.body);
            const todoId: string = uuid();
            const createdTodo = await todoService.createTodo({ id: todoId, ...todo })
            return res.status(201).json({ message: `Todo created.`, data: createdTodo });
        } catch (error) {
            return res.status(500).json({ message: `Could not create todo.` });
        }
    }

    static updateTodo = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { todoId } = todoIdParamSchema.parse(req.params);
            const todo = todoInputSchema.parse(req.body);
            const updatedTodo = await todoService.updateTodo(todoId, { id: todoId, ...todo });
            return res.status(200).json({ message: `Todo with id: ${todoId} updated.`, data: updatedTodo });
        } catch (error) {
            return res.status(500).json({ message: `Could not update todo.` });
        }
    }

    static deleteTodo = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { todoId } = todoIdParamSchema.parse(req.params);
            const deletedTodo = await todoService.deleteTodo(todoId);
            return res.status(200).json({ message: `Todo with id: ${todoId} found.`, data: deletedTodo });
        } catch (error) {
            return res.status(500).json({ message: `Could not delete todo.` });
        }
    }
}