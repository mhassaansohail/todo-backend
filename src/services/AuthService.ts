import { Result, Ok, Err, match } from "oxide.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
    service: any;
    repository: any;
    constructor(repository: any, service: any) {
        this.repository = repository
        this.service = service;
    }

    async loginWithOAuth() {
        try {
            const generatedUrl = await this.service.generateAuthURL(['profile', 'email']);
            const generatedUrlResult = match(generatedUrl, {
                Ok: (url) => url,
                Err: (error) => error
            });
            if (generatedUrlResult instanceof Error) {
                return Err(generatedUrlResult);
            }
            return Ok(generatedUrlResult)
        } catch (error) {
            return Err(new Error("Invalid credentials."));
        }
    }

    async loginByCredentials(userName: string, password: string) {
        try {
            const isValidUser = await this.validateUser(userName, password);
            if (!isValidUser) {
                Err(new Error("Invalid username or password."));
            }
            const secretKey: string = String(process.env.SECRET_KEY);
            return Ok(jwt.sign({ userName }, secretKey, { expiresIn: '6h' }));
        } catch (error) {
            return Err(error);
        }
    }

    async verifyToken(token: string) {
        try {
            const secretKey = String(process.env.SECRET_KEY)
            return Ok(jwt.verify(token, secretKey));
        } catch (error) {
            return Err(new Error("Invalid credentials."));
        }
    }

    private async validateUser(userName: string, password: string) {
        try {
            const user = await this.repository.fetchByUsername(userName);
            return bcrypt.compareSync(password, String(user?.password));
        } catch (error) {
            throw error;
        }
    }

    async callback(code: string) {
        try {
            return Ok(await this.service.getTokenFromCode(code));
        } catch (error) {
            return Err(new Error("Invalid code provided."));
        }
    }
}