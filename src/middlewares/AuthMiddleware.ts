import { Request, Response, NextFunction } from 'express';
import { oAuthService } from '../services';
import { authService } from '../services';

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
                let isVerified = await AuthMiddleware.verifyJWTToken(token);
                if (isVerified) {
                    next();
                } else {
                    isVerified = await AuthMiddleware.verifyOAuthToken(token);
                    if (isVerified) {
                        next();
                    } else {
                        return res.status(401).json({ message: "User unauthorized." });
                    }
                }
            }
        } catch (error) {
            return res.status(401).json({ message: "User unauthorized." });
        }
    }

    private static verifyOAuthToken = async (token: string): Promise<any> => {
        try {
            return await oAuthService.verifyToken(token);
        } catch (error) {
            return false;
        }
    }

    private static verifyJWTToken = async (token: string): Promise<any> => {
        try {
            return await authService.verifyToken(token);
        } catch (error) {
            return false;
        }
    }
}