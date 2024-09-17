import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../APP/Application/auth/AuthService';
import { Logger } from '../../APP/Infrastructure/logger/Logger';
import { autoInjectable } from "tsyringe";
import { AuthHeaderDto } from '../../APP/Application/DTO/';
import { VerifyTokenDto } from '../../APP/Application/DTO';


@autoInjectable()
export class AuthMiddleware {
    private service?: AuthService;
    private logger?: Logger;
    constructor(logger?: Logger, service?: AuthService) {
        this.logger = logger;
        this.service = service;
    }

    public authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
        const authHeader = req.headers;
        const authHeaderValidationResult = AuthHeaderDto.create(authHeader)
        if (authHeaderValidationResult.isErr()) {
            const { message } = authHeaderValidationResult.unwrapErr();
            this.logger?.error(message);
            return res.status(403).json({ status: "Unsuccesful", message });
        }
        const { authorization } = authHeaderValidationResult.unwrap();
        let isVerifiedTokenResult = await this.service?.verifyToken(VerifyTokenDto.create(authorization).unwrap());
        if (isVerifiedTokenResult?.isErr()) {
            this.logger?.error("Invalid Token.");
            return res.status(401).json({ message: "Invalid Token." });
        }
        next();
    }
}