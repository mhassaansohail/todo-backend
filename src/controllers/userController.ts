import { Request, Response, NextFunction } from "express";
import { userIdParamSchema, userParamsSchema, userInputSchema } from "./validators";
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class UserController {

    static getAllUsers = async (req: Request, res: Response): Promise<Response> => {
        try {
            const users = await prisma.user.findMany();
            if (users.length === 0) {
                return res.status(204).json({ message: `No users found.`, data: null });
            }
            return res.status(200).json({ message: `Users found.`, data: users });
        } catch (error) {
            return res.status(500).json({ message: `Could not fetch users.` });
        }
    }
    static getUserById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { userId } = userIdParamSchema.parse(req.params);
            const user = await prisma.user.findUnique({
                where: { id: String(userId) },
            });
            if (!user) {
                return res.status(204).json({ message: `No user with id: ${userId} found.`, data: null });
            }
            return res.status(200).json({ message: `User with id ${userId} found.`, data: user });
        } catch (error) {
            return res.status(500).json({ message: `Could not fetch user.` });
        }
    }
    static searchUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { name, userName, email } = userParamsSchema.parse(req.query);
            const users = await prisma.user.findMany({
                where: {
                    AND:
                        [
                            {
                                name: { contains: String(name) }
                            },
                            {
                                userName: { contains: String(userName) }
                            },
                            {
                                email: { contains: String(email) }
                            },
                        ]
                },
            });;
            if (users.length === 0) {
                return res.status(204).json({ message: `Users with params: name: ${name}, username: ${userName}, email: ${email} not found.`, data: null });
            } else {
                return res.status(200).json({ message: `Users with params: name: ${name}, username: ${userName}, email: ${email} found.`, data: users });
            }
        } catch (error) {
            return res.status(500).json({ message: `Could not fetch users.` });
        }
    }
    static createUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const user = userInputSchema.parse(req.body);
            if (!user.email || !user.userName) {
                throw new Error('New email and username are required for the creation.');
            }

            const existingUserWithEmail = await prisma.user.findFirst({
                where: { email: user.email },
            });

            const existingUserWithUsername = await prisma.user.findFirst({
                where: { userName: user.userName },
            });

            if (existingUserWithEmail) {
                return res.status(400).json({ message: 'Email is already in use by another user.' });
            }

            if (existingUserWithUsername) {
                return res.status(400).json({ message: 'Username is already in use by another user.' });
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
                    userName: user.userName,
                    email: user.email,
                    password: user.password,
                    age: user.age
                }
            });
            return res.status(201).json({ message: `User created`, data: userCreation });
        } catch (error) {
            return res.status(500).json({ message: `Could not create user.` });
        }
    }
    static updateUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { userId } = userIdParamSchema.parse(req.params);
            const user = userInputSchema.parse(req.body);
            const userExists = await prisma.user.findUnique({
                where: { id: userId }
            });
            if (!userExists) {
                return res.status(204).json({ message: `User with id: ${userId} does not exist.`, data: null });
            }
            const existingUserWithEmail = await prisma.user.findFirst({
                where: { email: user.email, NOT: { id: userId } },
            });

            const existingUserWithUsername = await prisma.user.findFirst({
                where: { userName: user.userName, NOT: { id: userId } },
            });

            if (existingUserWithEmail) {
                return res.status(400).json({ message: 'Email is already in use by another user.' });
            }

            if (existingUserWithUsername) {
                return res.status(400).json({ message: 'Username is already in use by another user.' });
            }
            const saltRounds = process.env.SALT_ROUNDS;
            const password = user.password;
            const hashedPassword = bcrypt.hashSync(password, Number(saltRounds));
            const userUpdation = await prisma.user.update({
                where: { id: userId },
                data: {
                    name: user.name,
                    userName: user.userName,
                    email: user.email,
                    password: hashedPassword,
                    age: user.age
                }
            });
            return res.status(200).json({ message: `User with id: ${userId} updated.`, data: userUpdation });
        } catch (error) {
            return res.status(500).json({ message: `Could not update user.` });
        }
    }
    static deleteUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { userId } = userIdParamSchema.parse(req.params);
            const userExists = await prisma.user.findUnique({
                where: { id: userId }
            });
            if (!userExists) {
                return res.status(204).json({ message: `User with id: ${userId} does not exist.`, data: null });
            }
            const userDeletion = await prisma.user.delete({
                where: { id: String(userId) },
            });
            return res.status(200).json({ message: `User with id: ${userId} deleted.`, data: userDeletion });
        } catch (error) {
            return res.status(500).json({ message: `Could not delete user.` });
        }
    }

}