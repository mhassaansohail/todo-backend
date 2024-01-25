import { Ok, Err, match } from "oxide.ts";
import { OAuthService } from "../../Infrastructure/services/OAuthService";
import { comparePassword } from "../../Infrastructure/services/EncryptionService";

import { UserRepository } from "../../Domain/repositories/UserRepository";
import { inject, injectable } from "tsyringe";
import { JWTService } from "../../Infrastructure/services/JWTService";

@injectable()
export class AuthService {
    constructor(@inject("UserRepository") private repository: UserRepository, @inject("JWTService") private jwtService: JWTService, @inject("OAuthService") private oAuthService: OAuthService) { }

    async loginWithOAuth(): Promise<Ok<string> | Err<Error>> {
        try {
            const generatedUrlResult = await this.oAuthService.generateAuthURL(['profile', 'email']);
            if (generatedUrlResult.isErr()) {
                const { message } = generatedUrlResult.unwrapErr();
                return Err(new Error(message));
            }
            return Ok(generatedUrlResult.unwrap())
        } catch (error) {
            return Err(new Error("Invalid credentials."));
        }
    }

    async loginByCredentials(userName: string, password: string): Promise<Ok<string> | Err<Error>> {
        try {
            const isValidUserResult = await this.validateUser(userName, password);
            if (isValidUserResult.isErr()) {
                const { message } = isValidUserResult.unwrapErr();
                return Err(new Error(message));
            }
            if (!isValidUserResult.unwrap()) {
                return Err(new Error("Invalid username or password."));
            }
            const tokenResult = await this.jwtService.genrateTokenFromParam(userName);
            if (tokenResult.isErr()) {
                const { message } = tokenResult.unwrapErr()
                return Err(new Error(message));
            }
            return Ok(tokenResult.unwrap());

        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async verifyToken(token: string): Promise<Ok<string> | Err<Error>> {
        try {
            let isvalidTokenResult = await this.jwtService.verifyToken(token);
            if (isvalidTokenResult.isErr()) {
                isvalidTokenResult = await this.oAuthService.verifyToken(token);
                if (isvalidTokenResult.isErr()) {
                    let { message } = isvalidTokenResult.unwrapErr();
                    return Err(new Error(message));
                }
            }
            return Ok(isvalidTokenResult.unwrap());
        } catch (error) {
            return Err(new Error("Invalid token."));
        }
    }

    private async validateUser(userName: string, password: string): Promise<Ok<boolean> | Err<Error>> {
        try {
            const user = await this.repository.fetchByUsername(userName);
            return Ok(comparePassword(password, String(user?.password)));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async callback(code: string): Promise<Ok<any> | Err<Error>> {
        try {
            const convertedTokenResult = await this.oAuthService.genrateTokenFromParam(code);
            if (convertedTokenResult.isErr()) {
                const { message } = convertedTokenResult.unwrapErr();
                return Err(new Error(message));
            }
            return Ok(convertedTokenResult.unwrap());
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }
}