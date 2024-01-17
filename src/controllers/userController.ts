import { Result, Ok, Err, None, Option, match } from "oxide.ts";
import { Request, Response } from "express";
import { validateUserIdParam, validateUserInput, validateUserPaginationOptions } from "./validators";
import bcrypt from 'bcrypt';
import { userService } from "../services";
import { PaginatedCollection } from "pagination";
import { User, NullUser } from "../domain/entities";

export class UserController {
    logger: any;

    constructor(logger: any) {
        this.logger = logger;
    }

    getUsers = async (req: Request, res: Response): Promise<Response> => {
        const queryParamsValidation = validateUserPaginationOptions(req.query);
        const validationResult = match(queryParamsValidation, {
            Ok: (searchParams) => searchParams,
            Err: (error) => error
        });
        if (validationResult instanceof Error) {
            this.logger.error(validationResult.message);
            return res.status(500).json({ message: validationResult.message });
        }
        const { offset, limit, name, email, userName } = validationResult;
        const conditionParams = { name, email, userName };
        const fetchedUsers = await userService.getUsers(offset, limit, conditionParams);
        const fetchedUsersResult = match(fetchedUsers, {
            Ok: (paginatedCollection: PaginatedCollection<User>) => paginatedCollection,
            Err: (error: any) => error,
        });
        if (fetchedUsersResult instanceof Error) {
            this.logger.error(fetchedUsersResult.message);
            return res.status(500).json({ message: fetchedUsersResult.message });
        }
        return res.status(200).json({ message: `Users found.`, data: fetchedUsersResult });
    }

    getUserById = async (req: Request, res: Response): Promise<Response> => {
        const userIdValidation = validateUserIdParam(req.params);
        const userIdValidationResult = match(userIdValidation, {
            Ok: (idParam) => idParam,
            Err: (error) => error
        });
        if (userIdValidationResult instanceof Error) {
            this.logger.error(userIdValidationResult.message);
            return res.status(500).json({ message: userIdValidationResult.message });
        }
        const { userId } = userIdValidationResult;
        const fetchedUser = await userService.getUserById(userId);
        const fetchedUserResult = match(fetchedUser, {
            Ok: (todo: any) => todo,
            Err: (error: Error) => error,
        });
        if (fetchedUserResult instanceof Error) {
            this.logger.error(fetchedUserResult.message);
            return res.status(500).json({ message: fetchedUserResult.message });
        } else if (fetchedUserResult instanceof NullUser) {
            return res.status(204).end();
        }
        return res.status(200).json({ message: `Todo with id: ${userId} found.`, data: fetchedUserResult });
    }

    createUser = async (req: Request, res: Response): Promise<Response> => {
        const userInputValidation = validateUserInput(req.body);
        const userinputValidationResult = match(userInputValidation, {
            Ok: (todoInput: any) => todoInput,
            Err: (error: Error) => error
        });
        if (userinputValidationResult instanceof Error) {
            this.logger.error(userinputValidationResult.message);
            return res.status(500).json({ message: userinputValidationResult.message });
        }
        const saltRounds = process.env.SALT_ROUNDS;
        const password = userinputValidationResult.password;
        const hashedPassword = bcrypt.hashSync(password, Number(saltRounds));
        userinputValidationResult.password = hashedPassword;
        const createdUser = await userService.createUser(userinputValidationResult);
        const createdUserResult = match(createdUser, {
            Ok: (user) => user,
            Err: (error: Error) => error
        });
        if (createdUserResult instanceof Error) {
            this.logger.error(createdUserResult.message);
            return res.status(500).json({ message: createdUserResult.message });
        }
        return res.status(201).json({ message: `User created.`, data: createdUserResult });
    }
    updateUser = async (req: Request, res: Response): Promise<Response> => {
        const userIdValidation = validateUserIdParam(req.params);
        const userIdValidationResult = match(userIdValidation, {
            Ok: (idParam) => idParam,
            Err: (error) => error
        });
        if (userIdValidationResult instanceof Error) {
            this.logger.error(userIdValidationResult.message);
            return res.status(500).json({ message: userIdValidationResult.message });
        }
        const { userId } = userIdValidationResult;
        const userInputValidation = validateUserInput(req.body);
        const userInputValidationResult = match(userInputValidation, {
            Ok: (todoInput: any) => todoInput,
            Err: (error: Error) => error
        });
        if (userInputValidationResult instanceof Error) {
            this.logger.error(userInputValidationResult.message);
            return res.status(500).json({ message: userInputValidationResult.message });
        }
        const saltRounds = process.env.SALT_ROUNDS;
        const password = userInputValidationResult.password;
        const hashedPassword = bcrypt.hashSync(password, Number(saltRounds));
        userInputValidationResult.password = hashedPassword;
        const updatedUser = await userService.updateUser(userId, { id: userId, ...userInputValidationResult });
        const updatedUserResult = match(updatedUser, {
            Ok: (user) => user,
            Err: (error: Error) => error
        });
        if (updatedUserResult instanceof Error) {
            this.logger.error(updatedUserResult.message);
            return res.status(500).json({ message: updatedUserResult.message });
        }
        return res.status(200).json({ message: `Todo with id: ${userId} updated.`, data: updatedUserResult });
    }
    deleteUser = async (req: Request, res: Response): Promise<Response> => {
        const userIdValidation = validateUserIdParam(req.params);
        const userIdValidationResult = match(userIdValidation, {
            Ok: (idParam) => idParam,
            Err: (error) => error
        });
        if (userIdValidationResult instanceof Error) {
            this.logger.error(userIdValidationResult.message);
            return res.status(500).json({ message: userIdValidationResult.message });
        }
        const { userId } = userIdValidationResult;
        const deletedUser = await userService.deleteUser(userId);
        const deletedUserResult = match(deletedUser, {
            Ok: (user: any) => user,
            Err: (error: Error) => error,
        });
        if (deletedUserResult instanceof Error) {
            this.logger.error(deletedUserResult.message);
            return res.status(500).json({ message: deletedUserResult.message });
        }
        return res.status(200).json({ message: `Todo with id: ${userId} found.`, data: deletedUserResult });
    }

}