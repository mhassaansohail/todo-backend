import { Ok, Err, Result } from "oxide.ts";
import { UserRepository } from "../../Domain/repositories/UserRepository";
import { inject, injectable } from "tsyringe";
import { IJWTAuthService } from "../ports/IJWTAuthService";
import { IOAuthService } from "../ports/IOAuthService";
import { IEncryptionService } from "../ports/IEncryptionService";

@injectable()
export class AuthService {
    private repository: UserRepository;
    private encryptionService: IEncryptionService;
    private jwtService: IJWTAuthService;
    private oAuthService: IOAuthService;

    constructor(
        @inject("UserRepository") repository: UserRepository,
        @inject("JWTService") jwtService: IJWTAuthService,
        @inject("OAuthService") oAuthService: IOAuthService,
        @inject("EncryptionService") encryptionService: IEncryptionService
    ) {
        this.repository = repository;
        this.encryptionService = encryptionService;
        this.jwtService = jwtService;
        this.oAuthService = oAuthService;

    }

    async loginWithOAuth(): Promise<Result<string, Error>> {
        try {
            const consentScreenUrlResult = await this.oAuthService.generateAuthURL(['profile']);
            return Ok(consentScreenUrlResult.unwrap())
        } catch (error) {
            return Err(new Error("Invalid credentials."));
        }
    }

    async loginByCredentials(userName: string, password: string): Promise<Result<string, Error>> {
        try {
            const isValidUserResult = await this.verifyUser(userName, password);
            if (!isValidUserResult.unwrap()) {
                return Err(new Error("Invalid username or password."));
            }
            const tokenResult = await this.jwtService.genrateTokenFromParam(userName);
            return Ok(tokenResult.unwrap());

        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async verifyToken(token: string): Promise<Result<string, Error>> {
        try {
            let isvalidTokenResult = await this.jwtService.verifyToken(token);
            if (isvalidTokenResult.isErr()) {
                isvalidTokenResult = await this.oAuthService.verifyToken(token);
            }
            return Ok(isvalidTokenResult.unwrap());
        } catch (error) {
            return Err(new Error("Invalid token."));
        }
    }

    private async verifyUser(userName: string, password: string): Promise<Result<boolean, Error>> {
        try {
            const user = await this.repository.fetchByUserNameOrEmail(userName);
            return Ok(this.encryptionService.comparePassword(password, String(user?._password)).unwrap());
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async callback(code: string): Promise<Result<any, Error>> {
        try {
            const convertedTokenResult = await this.oAuthService.genrateTokenFromParam(code);
            return Ok(convertedTokenResult.unwrap());
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }
}