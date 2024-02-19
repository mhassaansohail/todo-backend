import { oAuthService } from "./index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "stores";

export class AuthService {
    repository: UserRepository;
    constructor(repository: UserRepository) {
        this.repository = repository
    }

    async loginWithOAuth() {
        try {
            return await oAuthService.generateAuthURL(['profile', 'email']);
        } catch (error) {
            throw new Error("Invalid credentials.")
        }
    }

    async loginByCredentials(userName: string, password: string) {
        try {
            const isValidUser = await this.validateUser(userName, password);
            if (!isValidUser) {
                throw new Error("Invalid username or password.")
            }
            const secretKey: string = String(process.env.SECRET_KEY);
            return jwt.sign({ userName }, secretKey, { expiresIn: '6h' });
        } catch (error) {
            throw error;
        }
    }

    async verifyToken(token: string) {
        try {
            const secretKey = String(process.env.SECRET_KEY)
            return jwt.verify(token, secretKey);
        } catch (error) {
            throw new Error("Invalid credentials.")
        }
    }

    async validateUser(userName: string, password: string) {
        try {
            const user = await this.repository.fetchByUsername(userName);
            return bcrypt.compareSync(password, String(user?.password));
        } catch (error) {
            throw error;
        }
    }

    async callback(code: string) {
        try {
            return await oAuthService.getTokenFromCode(code);
        } catch (error) {
            throw new Error("Invalid code provided.")
        }
    }
}