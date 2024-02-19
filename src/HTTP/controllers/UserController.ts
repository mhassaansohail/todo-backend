import { Request, Response } from "express";
import { validateUserIdParam, validateUserInput, validateUserPaginationOptions } from "./inputValidators";
import bcrypt from 'bcrypt';
import { UserService } from "../../APP/Application/user/UserService";
import { inject, injectable } from "tsyringe";
import { Logger } from "../../APP/Infrastructure/logger/Logger";
import { UserAttributes } from "../../APP/Domain/types/user";
import { UserDTO } from "../DTO/user.dto";

@injectable()
export class UserController {
    private logger: Logger;
    private service: UserService
    constructor(@inject("Logger") logger: Logger, @inject("UserService") service: UserService) {
        this.logger = logger;
        this.service = service;
    }

    getUsers = async (req: Request, res: Response): Promise<Response> => {
        const queryParamsValidation = validateUserPaginationOptions(req.query);
        if (queryParamsValidation.isErr()) {
            const { message } = queryParamsValidation.unwrapErr();
            this.logger.error(message);
            return res.status(403).json({ status: "Unsuccesful", message });
        }
        const { pageSize, pageNumber, name, email, userName } = queryParamsValidation.unwrap();
        const fetchedUsersResult = await this.service.getUsers(pageNumber, pageSize, { name, email, userName });
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
        const fetchedUserResult = await this.service.getUserById(userId);
        if (fetchedUserResult.isErr()) {
            const { message } = fetchedUserResult.unwrapErr()
            this.logger.error(message);
            return res.status(400).json({ status: "Unsuccesful", message });
        }
        return res.status(200).json({ status: "Succesful", data: UserDTO.toPresentation(fetchedUserResult.unwrap()) });
    }

    createUser = async (req: Request, res: Response): Promise<Response> => {
        const userInputValidationResult = validateUserInput(req.body);
        if (userInputValidationResult.isErr()) {
            const { message } = userInputValidationResult.unwrapErr()
            this.logger.error(message);
            return res.status(403).json({ status: "Unsuccesful", message });
        }
        const userInput = userInputValidationResult.unwrap();
        const createdUserResult = await this.service.createUser(userInput as UserAttributes);
        if (createdUserResult.isErr()) {
            const { message } = createdUserResult.unwrapErr();
            this.logger.error(message);
            return res.status(400).json({ status: "Unsuccesful", message });
        }
        return res.status(201).json({ status: "Succesful", data: UserDTO.toPresentation(createdUserResult.unwrap()) });
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
        const updatedUserResult = await this.service.updateUser(userId, { userId, ...userInput });
        if (updatedUserResult.isErr()) {
            const { message } = updatedUserResult.unwrapErr();
            this.logger.error(message);
            return res.status(400).json({ status: "Unsuccesful", message });
        }
        return res.status(200).json({ status: "Succesful", data: UserDTO.toPresentation(updatedUserResult.unwrap()) });
    }

    deleteUser = async (req: Request, res: Response): Promise<Response> => {
        const userIdValidation = validateUserIdParam(req.params);
        if (userIdValidation.isErr()) {
            const { message } = userIdValidation.unwrapErr()
            this.logger.error(message);
            return res.status(403).json({ status: "Unsuccesful", message });
        }
        const { userId } = userIdValidation.unwrap();
        const deletedUserResult = await this.service.deleteUser(userId);
        if (deletedUserResult.isErr()) {
            const { message } = deletedUserResult.unwrapErr();
            this.logger.error(message);
            return res.status(400).json({ status: "Unsuccesful", message });
        }
        return res.status(200).json({ status: "Succesful", data: UserDTO.toPresentation(deletedUserResult.unwrap()) });
    }

}