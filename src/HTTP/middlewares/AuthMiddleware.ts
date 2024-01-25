import { Err, Ok, match } from 'oxide.ts';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../APP/Application/auth/AuthService';
import { Logger } from '../../APP/Infrastructure/logger/Logger';
import { autoInjectable, inject, injectable } from "tsyringe";

@autoInjectable()
export class AuthMiddleware {
    constructor(private logger?: Logger, private service?: AuthService) { }

    public authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            this.logger?.error("No authorization token provided.");
            return res.status(401).json({ error: "No authorization token provided." });
        }
        const authHeaderParts = authHeader.split(' ');
        if (!Array.isArray(authHeaderParts) || authHeaderParts.length !== 2) {
            this.logger?.error("Invalid token provided.");
            return res.status(401).json({ error: "Invalid token provided." });
        }
        const token = authHeaderParts[1];

        let isVerifiedTokenResult = await this.service?.verifyToken(token);
        if (isVerifiedTokenResult?.isErr()) {
            this.logger?.error("User unauthorized.");
            return res.status(401).json({ message: "User unauthorized." });
        }
        next();
    }
}