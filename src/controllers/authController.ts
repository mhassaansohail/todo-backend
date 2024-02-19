import { Request, Response } from 'express';
import { authCodeInputSchema, authInputSchema } from './validators';
import { authService } from '../services';

export class AuthController {

    static login = async (req: Request, res: Response): Promise<Response> => {
        try {
            const bodyKeysCount = Object.keys(req.body).length;
            if (bodyKeysCount === 2) {
                const { userName, password } = authInputSchema.parse(req.body);
                const token = await authService.loginByCredentials(userName, password);
                if (!token) {
                    return res.status(401).json({ message: 'Invalid username or password' });
                }
                return res.status(200).json({ token });
            } else if (bodyKeysCount === 0) {
                const consentScreenUrl = await authService.loginWithOAuth();
                return res.status(200).json({ consentScreenUrl });
            } else {
                return res.status(401).json({ message: 'Authentication failed' });
            }
        } catch (error) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
    }

    static callback = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { code } = authCodeInputSchema.parse(req.query);
            const token = await authService.callback(code);
            return res.json({ token });
        } catch (error) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
    }
}
