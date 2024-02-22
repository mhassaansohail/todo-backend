import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../../APP/Application/auth/AuthService';
import { Logger } from '../../APP/Infrastructure/logger/Logger';
import { inject, injectable } from 'tsyringe';
import { AuthCodeDto, LoginDto } from '../../APP/Application/DTO';


@injectable()
export class AuthController {
    private logger: Logger;
    private service: AuthService;
    constructor(@inject("Logger") logger: Logger, @inject("AuthService") service: AuthService) {
        this.logger = logger;
        this.service = service;
    }

    login = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
        try {
            const bodyKeysCount = Object.keys(req.body).length;
            if (bodyKeysCount === 2) {
                const authInputValidationResult = LoginDto.create(req.body);
                // if (authInputValidationResult.isErr()) {
                //     const { message } = authInputValidationResult.unwrapErr();
                //     this.logger.error(message);
                //     return res.status(401).json({ status: "Unsuccesful", message });
                // }
                const authenticationTokenResult = await this.service?.loginByCredentials(authInputValidationResult.unwrap());
                // if (authenticationTokenResult.isErr()) {
                //     const { message } = authenticationTokenResult.unwrapErr();
                //     this.logger.error(message);
                //     return res.status(401).json({ status: "Unsuccesful", message });
                // }
                return res.status(200).json({ status: "Succesful", token: authenticationTokenResult.unwrap() });
            } else {
                const consentScreenUrlResult = await this.service.loginWithOAuth();
                // if (consentScreenUrlResult.isErr()) {
                //     const { message } = consentScreenUrlResult.unwrapErr();
                //     this.logger.error(message);
                //     return res.status(401).json({ status: "Unsuccesful", message });
                // }
                return res.status(200).json({ status: "Succesful", url: consentScreenUrlResult.unwrap() });
            }
        } catch (error) {
            next(error);
        }
    }

    callback = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
        try {
            const codeInputValidationResult = AuthCodeDto.create(req.query);
            // if (codeInputValidationResult.isErr()) {
            //     const { message } = codeInputValidationResult.unwrapErr();
            //     this.logger.error(message);
            //     return res.status(401).json({ status: "Unsuccesful", message });
            // }
            const tokenGeneratedResult = await this.service.callback(codeInputValidationResult.unwrap());
            // if (tokenGeneratedResult.isErr()) {
            //     const { message } = tokenGeneratedResult.unwrapErr();
            //     this.logger.error(message);
            //     return res.status(401).json({ status: "Unsuccesful", message });
            // }
            return res.json({ status: "Succesful", token: tokenGeneratedResult.unwrap() });
        } catch (error) {
            next(error);
        }
    }
}
