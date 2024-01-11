import { Request, Response, NextFunction } from "express";
import { Prisma, PrismaClient } from '@prisma/client'
import { v4 as uuid } from 'uuid';
import { todoParamsSchema, todoSchema } from "./validations";
import { idSchema } from "./validations";
const prisma = new PrismaClient()

export class TodoController {

    constructor() {
    }

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const todos = await prisma.todo.findMany();
            if (todos.length === 0) {
                res.status(204).json({ message: `No todos found.`, data: null });
            }
            res.status(200).json({ message: `Todos found.`, data: todos });
        } catch (error) {
            res.status(500).json({ message: `Could not fetch todos.` });
        }
    }
    getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = idSchema.parse(req.params);
            const todo = await prisma.todo.findUnique({
                where: { id: id },
            });
            if (!todo) {
                res.status(204).json({ message: `No todo with id: ${id} found.`, data: null });
            } else {
                res.status(200).json({ message: `Todo with id: ${id} found.`, data: todo });
            }
        } catch (error) {
            res.status(500).json({ message: `Could not fetch todo` });
        }
    }
    getByParams = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
                res.status(204).json({ message: `Todos with params: title: ${title}, description: ${description}, completed: ${completed} not found.`, data: null });
            } else {
                res.status(200).json({ message: `Todos with params: title: ${title}, description: ${description}, completed: ${completed} found.`, data: todos });
            }
        } catch (error) {
            res.status(500).json({ message: `Could not fetch todos.` });
        }
    }
    add = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const todo = todoSchema.parse(req.body);
            const id: string = uuid();
            const todoCreation = await prisma.todo.create({
                data: {
                    id: id,
                    title: todo.title,
                    description: todo.description,
                    completed: todo.completed
                }
            });
            res.status(201).json({ message: `Todo created.`, data: todoCreation });
        } catch (error) {
            res.status(500).json({ message: `Could not create todo.` });
        }
    }
    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = idSchema.parse(req.params);
            const todo = todoSchema.parse(req.body);
            const todoExists = await prisma.todo.findUnique({
                where: { id: id }
            });
            if (!todoExists) {
                res.status(204).json({ message: `Todo with id: ${id} not updated.`, data: null });
            } else {
                const todoUpdation = await prisma.todo.update({
                    where: { id: id },
                    data: todo
                });
                res.status(200).json({ message: `Todo with id: ${id} updated.`, data: todoUpdation });
            }
        } catch (error) {
            res.status(500).json({ message: `Could not update todo.` });
        }
    }
    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = idSchema.parse(req.params);
            const todoExists = await prisma.todo.findUnique({
                where: { id: id }
            });
            if (!todoExists) {
                res.status(404).json({ message: `Todo with id: ${id} not found.`, data: null });
            }
            const todoDeletion = await prisma.todo.delete({
                where: { id: id },
            });
            res.status(200).json({ message: `Todo with id: ${id} found.`, data: todoDeletion });
        } catch (error) {
            res.status(500).json({ message: `Could not delete todo.` });
        }
    }
}