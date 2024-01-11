import { Request, Response, NextFunction } from "express";
import { idSchema, userParamsSchema, userSchema } from "./validations";
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class UserController {

    constructor() {
    }

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const users = await prisma.user.findMany();
            if (users.length === 0) {
                res.status(204).json({ message: `No users found.`, data: null });
            }
            res.status(200).json({ message: `Users found.`, data: users });
        } catch (error) {
            res.status(500).json({ message: `Could not fetch users.` });
        }
    }
    getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = idSchema.parse(req.params);
            const user = await prisma.user.findUnique({
                where: { id: String(id) },
            });
            if (!user) {
                res.status(204).json({ message: `No user with id: ${id} found.`, data: null });
            }
            res.status(200).json({ message: `User with id ${id} found.`, data: user });
        } catch (error) {
            res.status(500).json({ message: `Could not fetch user.` });
        }
    }
    getByParams = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, username, email } = userParamsSchema.parse(req.query);
            const users = await prisma.user.findMany({
                where: {
                    AND:
                        [
                            {
                                name: { contains: String(name) }
                            },
                            {
                                username: { contains: String(username) }
                            },
                            {
                                email: { contains: String(email) }
                            },
                        ]
                },
            });;
            if (users.length === 0) {
                res.status(204).json({ message: `Users with params: name: ${name}, username: ${username}, email: ${email} not found.`, data: null });
            } else {
                res.status(200).json({ message: `Users with params: name: ${name}, username: ${username}, email: ${email} found.`, data: users });
            }
        } catch (error) {
            res.status(500).json({ message: `Could not fetch users.` });
        }
    }
    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = userSchema.parse(req.body);
            if (!user.email || !user.username) {
                throw new Error('New email and username are required for the creation.');
            }

            const existingUserWithEmail = await prisma.user.findFirst({
                where: { email: user.email },
            });

            const existingUserWithUsername = await prisma.user.findFirst({
                where: { username: user.username },
            });

            if (existingUserWithEmail) {
                res.status(400).json({ message: 'Email is already in use by another user.' });
            }

            if (existingUserWithUsername) {
                res.status(400).json({ message: 'Username is already in use by another user.' });
            }
            const saltRounds = process.env.SALT_ROUNDS;
            const password = user.password;
            const hashedPassword = bcrypt.hashSync(password, Number(saltRounds));
            user.password = hashedPassword;
            const id = uuid();
            const userCreation = await prisma.user.create({
                data: {
                    id: id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    age: user.age
                }
            });
            res.status(201).json({ message: `User created`, data: userCreation });
        } catch (error) {
            res.status(500).json({ message: `Could not create user.` });
        }
    }
    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = idSchema.parse(req.params);
            const user = userSchema.parse(req.body);
            const userExists = await prisma.user.findUnique({
                where: { id: id }
            });
            if (!userExists) {
                res.status(204).json({ message: `User with id: ${id} does not exist.`, data: null });
            }
            const existingUserWithEmail = await prisma.user.findFirst({
                where: { email: user.email, NOT: { id: id } },
            });

            const existingUserWithUsername = await prisma.user.findFirst({
                where: { username: user.username, NOT: { id: id } },
            });

            if (existingUserWithEmail) {
                res.status(400).json({ message: 'Email is already in use by another user.' });
            }

            if (existingUserWithUsername) {
                res.status(400).json({ message: 'Username is already in use by another user.' });
            }
            const saltRounds = process.env.SALT_ROUNDS;
            const password = user.password;
            const hashedPassword = bcrypt.hashSync(password, Number(saltRounds));
            const userUpdation = await prisma.user.update({
                where: { id: id },
                data: {
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    password: hashedPassword,
                    age: user.age
                }
            });
            res.status(200).json({ message: `User with id: ${id} updated.`, data: userUpdation });
        } catch (error) {
            res.status(500).json({ message: `Could not update user.` });
        }
    }
    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = idSchema.parse(req.params);
            const userExists = await prisma.user.findUnique({
                where: { id: id }
            });
            if (!userExists) {
                res.status(204).json({ message: `User with id: ${id} does not exist.`, data: null });
            }
            const userUpdation = await prisma.user.delete({
                where: { id: String(id) },
            });
            res.status(200).json({ message: `User with id: ${id} deleted.`, data: userUpdation });
        } catch (error) {
            res.status(500).json({ message: `Could not delete users.` });
        }
    }

}