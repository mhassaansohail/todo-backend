import { Request, Response } from 'express';
import { authSchema } from './validations';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class AuthController {
    constructor() {
    }

    login = async (req: Request, res: Response): Promise<void> => {
        const { username, password } = authSchema.parse(req.body);
        try {
            const isValid = await this.validateUser(username, password);
            if (!isValid) {
                res.status(401).json({ message: 'Invalid username or password' });
            }
            const secretKey: string = String(process.env.SECRET_KEY);
            const token = jwt.sign({ username }, secretKey, { expiresIn: '6h' });
            res.status(200).json({ message: "User logged in.", token });
        } catch (error) {
            res.status(401).json({ message: 'Authentication failed' });
        }
    }

    async validateUser(username: string, password: string): Promise<boolean> {
        try {
            const user = await prisma.user.findUnique({
                where: { username: username }
            });
            return bcrypt.compareSync(password, String(user?.password));
        } catch (error) {
            throw error;
        }
    }
}
