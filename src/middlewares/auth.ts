import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

class AuthMiddleware {
    constructor() {
    }

    authenticator = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                res.status(401).json({ error: "No authorization token provided." });
            } else {
                const authHeaderParts = authHeader.split(' ');
                if (!Array.isArray(authHeaderParts)) {
                    res.status(401).json({ error: "Invalid token provided." });
                }
                const token = authHeaderParts[1];
                await this.authenticateToken(token);
                next();
            }
        } catch (error) {
            res.status(401).json({ error: error });
        }
    }

    authenticateToken = async (token: string): Promise<object> => {
        try {
            const secretKey: string = String(process.env.SECRET_KEY);
            return Object(jwt.verify(token, secretKey));
        } catch (error) {
            throw error;
        }
    }
}

export default new AuthMiddleware().authenticator;
