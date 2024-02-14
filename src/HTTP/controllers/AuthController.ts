import { Request, Response } from 'express';
import { authInputValidator, validateAuthInput } from './validators';
import { AuthService } from '../../APP/Application/auth/AuthService';
import { Logger } from '../../APP/Infrastructure/logger/Logger';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AuthController {
    private logger: Logger;
    private service: AuthService;
    constructor(@inject("Logger") logger: Logger, @inject("AuthService") service: AuthService) {
        this.logger = logger;
        this.service = service;
     }

    login = async (req: Request, res: Response): Promise<Response> => {
        const authInputValidationResult = validateAuthInput(req.body);
        if (authInputValidationResult.isErr()) {
            const { message } = authInputValidationResult.unwrapErr();
            this.logger.error(message);
            return res.status(401).json({ status: "Unsuccesful", message });
        }
        const bodyKeysCount = Object.keys(authInputValidationResult.unwrap()).length;
        if (bodyKeysCount === 2) {
            const { userName, password } = authInputValidationResult.unwrap();
            const authenticationTokenResult = await this.service?.loginByCredentials(userName, password);
            if (authenticationTokenResult.isErr()) {
                const { message } = authenticationTokenResult.unwrapErr();
                this.logger.error(message);
                return res.status(401).json({ status: "Unsuccesful", message: "Invalid username or password." });
            }
            const token = authenticationTokenResult.unwrap();
            return res.status(200).json({ status: "Succesful", token });
        } else {
            const consentScreenUrlResult = await this.service.loginWithOAuth();
            if (consentScreenUrlResult.isErr()) {
                const { message } = consentScreenUrlResult.unwrapErr();
                this.logger.error(message);
                return res.status(401).json({ status: "Unsuccesful", message });
            }
            const consentScreenUrl = consentScreenUrlResult.unwrap();
            return res.status(200).json({ status: "Succesful", url: consentScreenUrl });
        }
    }

    callback = async (req: Request, res: Response): Promise<Response> => {
        const codeInputValidationResult = authInputValidator(req.query);
        if (codeInputValidationResult.isErr()) {
            const { message } = codeInputValidationResult.unwrapErr();
            this.logger.error(message);
            return res.status(401).json({ status: "Unsuccesful", message });
        }
        const { code } = codeInputValidationResult.unwrap();
        const tokenGeneratedResult = await this.service.callback(code);
        if (tokenGeneratedResult.isErr()) {
            const { message } = tokenGeneratedResult.unwrapErr();
            this.logger.error(message);
            return res.status(401).json({ status: "Unsuccesful", message: "Invalid username or password." });
        }
        const token = tokenGeneratedResult.unwrap();
        return res.json({ status: "Succesful", token });
    }
}
