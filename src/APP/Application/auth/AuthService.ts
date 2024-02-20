import { Result } from "@carbonteq/fp";
import { UserRepository } from "../../Domain/repositories/UserRepository";
import { inject, injectable } from "tsyringe";
import { IJWTAuthService } from "../ports/IJWTAuthService";
import { IOAuthService } from "../ports/IOAuthService";
import { IEncryptionService } from "../ports/IEncryptionService";
import { ILoginByCredentials } from "./DTO/ILoginByCreds.dto";
import { IVerifyToken } from "./DTO/IVerifyToken.dto";

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
            return Result.Ok(consentScreenUrlResult.unwrap())
        } catch (error) {
            return Result.Err(new Error("Invalid credentials."));
        }
    }

    async loginByCredentials({ userName, password }: ILoginByCredentials): Promise<Result<string, Error>> {
        try {
            const isValidUserResult = await this.verifyUser(userName, password);
            if (!isValidUserResult.unwrap()) {
                return Result.Err(new Error("Invalid username or password."));
            }
            const tokenResult = await this.jwtService.genrateTokenFromParam(userName);
            return Result.Ok(tokenResult.unwrap());

        } catch (error: any) {
            return Result.Err(new Error(error.message));
        }
    }

    async verifyToken({ token }: IVerifyToken): Promise<Result<string, Error>> {
        try {
            let isvalidTokenResult = await this.jwtService.verifyToken(token);
            if (isvalidTokenResult.isErr()) {
                isvalidTokenResult = await this.oAuthService.verifyToken(token);
            }
            return Result.Ok(isvalidTokenResult.unwrap());
        } catch (error) {
            return Result.Err(new Error("Invalid token."));
        }
    }

    private async verifyUser(userName: string, password: string): Promise<Result<boolean, Error>> {
        try {
            const user = (await this.repository.fetchByUserNameOrEmail(userName)).unwrap();
            return Result.Ok(this.encryptionService.comparePassword(password, String(user.password)).unwrap());
        } catch (error: any) {
            return Result.Err(new Error(error.message));
        }
    }

    async callback(code: string): Promise<Result<any, Error>> {
        try {
            const convertedTokenResult = await this.oAuthService.genrateTokenFromParam(code);
            return Result.Ok(convertedTokenResult.unwrap());
        } catch (error: any) {
            return Result.Err(new Error(error.message));
        }
    }
}