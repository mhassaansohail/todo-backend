import { Request, Response, NextFunction } from 'express';

export class AuthMiddleware {
    oAuthService: any;
    authService: any;
    constructor(authService: any, oAuthService: any) {
        this.authService = authService;
        this.oAuthService = oAuthService;
    }

    public authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
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
                let isVerified = await this.verifyJWTToken(token);
                if (isVerified) {
                    next();
                } else {
                    isVerified = await this.verifyOAuthToken(token);
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

    private verifyOAuthToken = async (token: string): Promise<any> => {
        try {
            return await this.oAuthService.verifyToken(token);
        } catch (error) {
            return false;
        }
    }

    private verifyJWTToken = async (token: string): Promise<any> => {
        try {
            return await this.authService.verifyToken(token);
        } catch (error) {
            return false;
        }
    }
}