import { Request, Response } from 'express';
import { authInputValidator, validateAuthInput } from './validators';
import { authService } from '../services';
import { Err, match } from 'oxide.ts';

export class AuthController {
    service: any;
    logger: any;
    constructor(logger: any) {
        this.logger = logger;
        this.service = authService;
    }

    login = async (req: Request, res: Response): Promise<Response> => {
        const bodyKeysCount = Object.keys(req.body).length;
        if (bodyKeysCount === 2) {
            const authInputValidation = (validateAuthInput(req.body));
            const authInputValidationResult = match(authInputValidation, {
                Ok: (authInput) => authInput,
                Err: (error) => error
            });
            if (authInputValidationResult instanceof Error) {
                this.logger.error(authInputValidationResult.message);
                return res.status(401).json({ message: authInputValidationResult.message });
            }

            const { userName, password } = authInputValidationResult;
            const authenticationToken = await this.service.loginByCredentials(userName, password);
            const tokenResult = match(authenticationToken, {
                Ok: (token) => token,
                Err: (error) => error
            });
            if (tokenResult instanceof Error) {
                this.logger.error(tokenResult.message);
                return res.status(401).json({ message: "Invalid username or password." });
            }
            return res.status(200).json({ message: "Login successful.", token: tokenResult });
        } else if (bodyKeysCount === 0) {
            const consentScreenUrl = await this.service.loginWithOAuth();
            const consentScreenUrlResult = match(consentScreenUrl, {
                Ok: (url) => url,
                Err: (error) => error
            });
            if (consentScreenUrlResult instanceof Error) {
                this.logger.error(consentScreenUrlResult.message);
                return res.status(401).json({ message: "Authentication failed." });
            }
            return res.status(200).json({ message: "Login successful.", url: consentScreenUrlResult });
        } else {
            this.logger.error("Invalid number of inputs provided.");
            return res.status(401).json({ message: "Authentication failed" });
        }
    }

    callback = async (req: Request, res: Response): Promise<Response> => {
        const codeInputValidation = authInputValidator(req.query);
        const codeInputValidationResult = match(codeInputValidation, {
            Ok: (code) => code,
            Err: (error) => error
        });
        if (codeInputValidationResult instanceof Error) {
            this.logger.error(codeInputValidationResult.message);
            return res.status(401).json({ message: codeInputValidationResult.message });
        }
        const { code } = codeInputValidationResult;
        const generatedToken = await this.service.callback(code);
        const generatedTokenResult = match(generatedToken, {
            Ok: (token) => token,
            Err: (error) => error
        });
        if (generatedTokenResult instanceof Error) {
            this.logger.error(generatedTokenResult.message);
            return res.status(401).json({ message: 'Authentication failed' });
        }
        return res.json({ message: "Login successful", token: generatedTokenResult });
    }
}
