import { Request, Response } from "express";
import { userIdParamSchema, userParamsSchema, userInputSchema, userPaginationOptionsInputSchema } from "./validators";
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { userService } from "../services";
export class UserController {

    static getUsers = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { offset, limit, name, email, userName } = userPaginationOptionsInputSchema.parse(req.query);
            const conditionParams = { name, email, userName };
            const users = await userService.getUsers(offset, limit, conditionParams);
            if (users.rowsInCurrentPage === 0) {
                return res.status(204).json({ message: `No users found on current page.`, data: users });
            } else {
                return res.status(200).json({ message: `Users found.`, data: users });
            }
        } catch (error) {
            return res.status(500).json({ message: `Could not fetch users.` });
        }
    }

    static getUserById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { userId } = userIdParamSchema.parse(req.params);
            const user = await userService.getUserById(userId);
            if (!user) {
                return res.status(204).json({ message: `No user with id: ${userId} found.`, data: null });
            }
            return res.status(200).json({ message: `User with id ${userId} found.`, data: user });
        } catch (error) {
            return res.status(500).json({ message: `Could not fetch user.` });
        }
    }

    static createUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const user = userInputSchema.parse(req.body);
            const userId = uuid();
            const saltRounds = process.env.SALT_ROUNDS;
            const password = user.password;
            const hashedPassword = bcrypt.hashSync(password, Number(saltRounds));
            user.password = hashedPassword;
            const createdUser = await userService.createUser({ id: userId, ...user });
            return res.status(201).json({ message: `User created`, data: createdUser });
        } catch (error) {
            return res.status(500).json({ message: `Could not create user.` });
        }
    }
    static updateUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { userId } = userIdParamSchema.parse(req.params);
            const user = userInputSchema.parse(req.body);
            const saltRounds = process.env.SALT_ROUNDS;
            const password = user.password;
            const hashedPassword = bcrypt.hashSync(password, Number(saltRounds));
            user.password = hashedPassword;
            const updatedUser = await userService.updateUser(userId, { id: userId, ...user });
            return res.status(200).json({ message: `User with id: ${userId} updated.`, data: updatedUser });
        } catch (error) {
            return res.status(500).json({ message: `Could not update user.` });
        }
    }
    static deleteUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { userId } = userIdParamSchema.parse(req.params);
            const deletedUser = await userService.deleteUser(userId);
            return res.status(200).json({ message: `User with id: ${userId} deleted.`, data: deletedUser });
        } catch (error) {
            return res.status(500).json({ message: `Could not delete user.` });
        }
    }

}