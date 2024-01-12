import { Request, Response } from 'express';
import { authInputSchema } from './validators';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class AuthController {

    public static login = async (req: Request, res: Response): Promise<Response> => {
        const { userName, password } = authInputSchema.parse(req.body);
        try {
            const isValidUser = await AuthController.validateUser(userName, password);
            if (!isValidUser) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            const secretKey: string = String(process.env.SECRET_KEY);
            const token = jwt.sign({ userName }, secretKey, { expiresIn: '6h' });
            return res.status(200).json({ message: "User logged in.", token });
        } catch (error) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
    }

    private static validateUser = async(userName: string, password: string): Promise<boolean> => {
        try {
            const user = await prisma.user.findUnique({
                where: { userName: userName }
            });
            return bcrypt.compareSync(password, String(user?.password));
        } catch (error) {
            throw error;
        }
    }
}
