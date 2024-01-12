import { Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { todoIdParamSchema, todoParamsSchema, todoInputSchema,  } from "./validators";
const prisma = new PrismaClient();

export class TodoController {

    static getAllTodos = async (req: Request, res: Response): Promise<Response> => {
        try {
            const todos = await prisma.todo.findMany();
            if (todos.length === 0) {
                return res.status(204).json({ message: `No todos found.`, data: null });
            }
            return res.status(200).json({ message: `Todos found.`, data: todos });
        } catch (error) {
            return res.status(500).json({ message: `Could not fetch todos.` });
        }
    }
    static getTodoById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { todoId } = todoIdParamSchema.parse(req.params);
            const todo = await prisma.todo.findUnique({
                where: { id: todoId },
            });
            if (!todo) {
                return res.status(204).json({ message: `No todo with id: ${todoId} found.`, data: null });
            } else {
                return res.status(200).json({ message: `Todo with id: ${todoId} found.`, data: todo });
            }
        } catch (error) {
            return res.status(500).json({ message: `Could not fetch todo` });
        }
    }
    static searchTodo = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { title, description, completed } = todoParamsSchema.parse(req.query);
            const todos = await prisma.todo.findMany({
                where: {
                    AND:
                        [
                            {
                                title: { contains: title }
                            },
                            {
                                description: { contains: description }
                            },
                            {
                                completed: completed
                            },
                        ]
                },
            })
            if (todos.length === 0) {
                return res.status(204).json({ message: `Todos with params: title: ${title}, description: ${description}, completed: ${completed} not found.`, data: null });
            } else {
                return res.status(200).json({ message: `Todos with params: title: ${title}, description: ${description}, completed: ${completed} found.`, data: todos });
            }
        } catch (error) {
            return res.status(500).json({ message: `Could not fetch todos.` });
        }
    }
    static createTodo = async (req: Request, res: Response): Promise<Response> => {
        try {
            const todo = todoInputSchema.parse(req.body);
            const todoId: string = uuid();
            const todoCreation = await prisma.todo.create({
                data: {
                    id: todoId,
                    title: todo.title,
                    description: todo.description,
                    completed: todo.completed
                }
            });
            return res.status(201).json({ message: `Todo created.`, data: todoCreation });
        } catch (error) {
            return res.status(500).json({ message: `Could not create todo.` });
        }
    }
    static updateTodo = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { todoId } = todoIdParamSchema.parse(req.params);
            const todo = todoInputSchema.parse(req.body);
            const todoExists = await prisma.todo.findUnique({
                where: { id: todoId }
            });
            if (!todoExists) {
                return res.status(204).json({ message: `Todo with id: ${todoId} not updated.`, data: null });
            } else {
                const todoUpdation = await prisma.todo.update({
                    where: { id: todoId },
                    data: todo
                });
                return res.status(200).json({ message: `Todo with id: ${todoId} updated.`, data: todoUpdation });
            }
        } catch (error) {
            return res.status(500).json({ message: `Could not update todo.` });
        }
    }
    static deleteTodo = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { todoId } = todoIdParamSchema.parse(req.params);
            const todoExists = await prisma.todo.findUnique({
                where: { id: todoId }
            });
            if (!todoExists) {
                return res.status(404).json({ message: `Todo with id: ${todoId} not found.`, data: null });
            }
            const todoDeletion = await prisma.todo.delete({
                where: { id: todoId },
            });
            return res.status(200).json({ message: `Todo with id: ${todoId} found.`, data: todoDeletion });
        } catch (error) {
            return res.status(500).json({ message: `Could not delete todo.` });
        }
    }
}