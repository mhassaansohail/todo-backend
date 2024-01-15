import { Request, Response } from 'express';
import { authCodeInputSchema } from './validators';
import { AuthService } from '../services';

export class AuthController {

    static login = async (req: Request, res: Response): Promise<Response> => {
        try {
            const resultantUrl = await AuthService.login();
            return res.status(200).json(resultantUrl);
        } catch (error) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
    }

    static callback = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { code } = authCodeInputSchema.parse(req.query);
            const token = await AuthService.callback(code);
            return res.json({ token });
        } catch (error) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
    }
}
