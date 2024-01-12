import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export class AuthMiddleware {

    public static authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ error: "No authorization token provided." });
            } else {
                const authHeaderParts = authHeader.split(' ');
                if (!Array.isArray(authHeaderParts)) {
                    return res.status(401).json({ error: "Invalid token provided." });
                }
                const token = authHeaderParts[1];
                await AuthMiddleware.verifyToken(token);
                next();
            }
        } catch (error) {
            return res.status(401).json({ error: error });
        }
    }

    private static verifyToken = async (token: string): Promise<object> => {
        try {
            const secretKey: string = String(process.env.SECRET_KEY);
            return Object(jwt.verify(token, secretKey));
        } catch (error) {
            throw error;
        }
    }
}
