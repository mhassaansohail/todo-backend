import { NextFunction, Request, Response } from "express";
import { UserService } from "../../APP/Application/services/user/UserService";
import { inject, injectable } from "tsyringe";
import { Logger } from "../../APP/Infrastructure/logger/Logger";
import { CreateUserDto, FetchUserPaginationOptionsDto, UpdateUserDto, UserDto, UserIdDto } from "../../APP/Application/dto";

@injectable()
export class UserController {
    private logger: Logger;
    private service: UserService
    constructor(@inject("Logger") logger: Logger, @inject("UserService") service: UserService) {
        this.logger = logger;
        this.service = service;
    }

    getUsers = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
        try {
            const queryParamsValidation = FetchUserPaginationOptionsDto.create(req.query);
            const fetchedUsersResult = await this.service.getUsers(queryParamsValidation.unwrap());
            return res.status(200).json({ status: "Succesful", data: fetchedUsersResult.unwrap() });
        } catch (error) {
            next(error);
        }
    }

    getUserById = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
        try {
            const userIdValidation = UserIdDto.create(req.params);
            const fetchedUserResult = await this.service.getUserById(userIdValidation.unwrap());
            return res.status(200).json({ status: "Succesful", data: fetchedUserResult.unwrap() });
        } catch (error) {
            next(error);
        }
    }

    createUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
        try {
            const userInputValidationResult = CreateUserDto.create(req.body);
            if (userInputValidationResult.isErr()) {
                const { message } = userInputValidationResult.unwrapErr()
                this.logger.error(message);
                return res.status(403).json({ status: "Unsuccesful", message });
            }
            const createdUserResult = await this.service.createUser(userInputValidationResult.unwrap());
            if (createdUserResult.isErr()) {
                const { message } = createdUserResult.unwrapErr();
                this.logger.error(message);
                return res.status(400).json({ status: "Unsuccesful", message });
            }
            return res.status(201).json({ status: "Succesful", data: UserDto.toPresentation(createdUserResult.unwrap()) });
            // return res.status(201).json({ status: "Succesful", data: createdUserResult.unwrap() });
        } catch (error) {
            next(error);
        }
    }

    updateUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
        try {
            const userIdValidation = UserIdDto.create(req.params);
            if (userIdValidation.isErr()) {
                const { message } = userIdValidation.unwrapErr();
                this.logger.error(message);
                return res.status(403).json({ status: "Unsuccesful", message });
            }
            const userInputValidationResult = UpdateUserDto.create({ userId: userIdValidation.unwrap(), ...req.body });
            if (userInputValidationResult.isErr()) {
                const { message } = userInputValidationResult.unwrapErr()
                this.logger.error(message);
                return res.status(403).json({ status: "Unsuccesful", message });
            }
            const updatedUserResult = await this.service.updateUser(userInputValidationResult.unwrap());
            if (updatedUserResult.isErr()) {
                const { message } = updatedUserResult.unwrapErr();
                this.logger.error(message);
                return res.status(400).json({ status: "Unsuccesful", message });
            }
            return res.status(200).json({ status: "Succesful", data: UserDto.toPresentation(updatedUserResult.unwrap()) });
            // return res.status(200).json({ status: "Succesful", data: updatedUserResult.unwrap() });
        } catch (error) {
            next(error);
        }
    }

    deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
        try {
            const userIdValidation = UserIdDto.create(req.params);
            if (userIdValidation.isErr()) {
                const { message } = userIdValidation.unwrapErr()
                this.logger.error(message);
                return res.status(403).json({ status: "Unsuccesful", message });
            }
            const deletedUserResult = await this.service.deleteUser(userIdValidation.unwrap());
            if (deletedUserResult.isErr()) {
                const { message } = deletedUserResult.unwrapErr();
                this.logger.error(message);
                return res.status(400).json({ status: "Unsuccesful", message });
            }
            // return res.status(200).json({ status: "Succesful", data: UserDto.toPresentation(deletedUserResult.unwrap()) });
            return res.status(200).json({ status: "Succesful", data: deletedUserResult.unwrap() });
        } catch (error) {
            next(error);
        }
    }
}