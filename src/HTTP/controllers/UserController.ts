import { Request, Response } from "express";
import { validateUserIdParam, validateUserInput, validateUserPaginationOptions } from "./validators";
import bcrypt from 'bcrypt';
import { userService } from "../../APP/Infrastructure/IoC/container";
import { inject, injectable } from "tsyringe";
import { Logger } from "../../APP/Infrastructure/logger/Logger";
import { UserAttributes } from "../../APP/Domain/types/user";

@injectable()
export class UserController {
    constructor(@inject("Logger") private logger: Logger) {
        this.logger = logger;
    }

    getUsers = async (req: Request, res: Response): Promise<Response> => {
        const queryParamsValidation = validateUserPaginationOptions(req.query);
        if (queryParamsValidation.isErr()) {
            const { message } = queryParamsValidation.unwrapErr();
            this.logger.error(message);
            return res.status(403).json({ status: "Unsuccesful", message });
        }
        const { offset, limit, name, email, userName } = queryParamsValidation.unwrap();
        const fetchedUsersResult = await userService.getUsers(offset, limit, { name, email, userName });
        if (fetchedUsersResult.isErr()) {
            const { message } = fetchedUsersResult.unwrapErr();
            this.logger.error(message);
            return res.status(400).json({ status: "Unsuccesful", message });
        }
        const fetchedUsers = fetchedUsersResult.unwrap();
        return res.status(200).json({ status: "Succesful", data: fetchedUsers });
    }

    getUserById = async (req: Request, res: Response): Promise<Response> => {
        const userIdValidation = validateUserIdParam(req.params);
        if (userIdValidation.isErr()) {
            const { message } = userIdValidation.unwrapErr()
            this.logger.error(message);
            return res.status(403).json({ status: "Unsuccesful", message });
        }
        const { userId } = userIdValidation.unwrap();
        const fetchedUserResult = await userService.getUserById(userId);
        if (fetchedUserResult.isErr()) {
            const { message } = fetchedUserResult.unwrapErr()
            this.logger.error(message);
            return res.status(400).json({ status: "Unsuccesful", message });
        }
        const fetchedUser = fetchedUserResult.unwrap();
        return res.status(200).json({ status: "Succesful", data: fetchedUser });
    }

    createUser = async (req: Request, res: Response): Promise<Response> => {
        const userInputValidationResult = validateUserInput(req.body);
        if (userInputValidationResult.isErr()) {
            const { message } = userInputValidationResult.unwrapErr()
            this.logger.error(message);
            return res.status(403).json({ status: "Unsuccesful", message });
        }
        const userInput = userInputValidationResult.unwrap();
        const saltRounds = process.env.SALT_ROUNDS;
        const password = userInput.password;
        const hashedPassword = bcrypt.hashSync(password, Number(saltRounds));
        userInput.password = hashedPassword;
        const createdUserResult = await userService.createUser(userInput as UserAttributes);
        if (createdUserResult.isErr()) {
            const { message } = createdUserResult.unwrapErr();
            this.logger.error(message);
            return res.status(400).json({ status: "Unsuccesful", message });
        }
        const createdUser = createdUserResult.unwrap();
        return res.status(201).json({ status: "Succesful", data: createdUser });
    }

    updateUser = async (req: Request, res: Response): Promise<Response> => {
        const userIdValidation = validateUserIdParam(req.params);
        if (userIdValidation.isErr()) {
            const { message } = userIdValidation.unwrapErr();
            this.logger.error(message);
            return res.status(403).json({ status: "Unsuccesful", message });
        }
        const { userId } = userIdValidation.unwrap();
        const userInputValidationResult = validateUserInput(req.body);
        if (userInputValidationResult.isErr()) {
            const { message } = userInputValidationResult.unwrapErr()
            this.logger.error(message);
            return res.status(403).json({ status: "Unsuccesful", message });
        }
        const userInput = userInputValidationResult.unwrap();
        const saltRounds = process.env.SALT_ROUNDS;
        const password = userInput.password;
        const hashedPassword = bcrypt.hashSync(password, Number(saltRounds));
        userInput.password = hashedPassword;
        const updatedUserResult = await userService.updateUser(userId, { userId, ...userInput });
        if (updatedUserResult.isErr()) {
            const { message } = updatedUserResult.unwrapErr();
            this.logger.error(message);
            return res.status(400).json({ status: "Unsuccesful", message });
        }
        const updatedUser = updatedUserResult.unwrap();
        return res.status(200).json({ status: "Succesful", data: updatedUser });
    }

    deleteUser = async (req: Request, res: Response): Promise<Response> => {
        const userIdValidation = validateUserIdParam(req.params);
        if (userIdValidation.isErr()) {
            const { message } = userIdValidation.unwrapErr()
            this.logger.error(message);
            return res.status(403).json({ status: "Unsuccesful", message });
        }
        const { userId } = userIdValidation.unwrap();
        const deletedUserResult = await userService.deleteUser(userId);
        if (deletedUserResult.isErr()) {
            const { message } = deletedUserResult.unwrapErr();
            this.logger.error(message);
            return res.status(400).json({ status: "Unsuccesful", message });
        }
        const deletedUser = deletedUserResult.unwrap();
        return res.status(200).json({ status: "Succesful", data: deletedUser });
    }

}