import { Result } from "@carbonteq/fp";
import { UserRepository } from "../../Domain/repositories/UserRepository";
import { inject, injectable } from "tsyringe";
import { IJWTAuthService } from "../ports/IJWTAuthService";
import { IOAuthService } from "../ports/IOAuthService";
import { IEncryptionService } from "../ports/IEncryptionService";
import { AuthCodeDto, LoginDto, VerifyTokenDto } from "../DTO";
import { AppResult } from "@carbonteq/hexapp";
import { InvalidCredentials } from "../exceptions/auth/InvalidCredentials.exception";
import { InvalidToken } from "../exceptions/auth/InvalidToken.exception";

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

    async loginWithOAuth(): Promise<AppResult<string>> {
        try {
            const consentScreenUrlResult = await this.oAuthService.generateAuthURL(['profile']);
            return AppResult.fromResult(Result.Ok(consentScreenUrlResult.unwrap()));
        } catch (error: any) {
            return AppResult.fromResult(Result.Err(error));
        }
    }

    async loginByCredentials({ userName, password }: LoginDto): Promise<AppResult<string>> {
        try {
            const isValidUserResult = await this.verifyUser(userName, password);
            if (!isValidUserResult.unwrap()) {
                return AppResult.fromResult(Result.Err(new InvalidCredentials()));
            }
            const tokenResult = await this.jwtService.genrateTokenFromParam(userName);
            return AppResult.fromResult(Result.Ok(tokenResult.unwrap()));

        } catch (error: any) {
            return AppResult.fromResult(Result.Err(error));
        }
    }

    async verifyToken({ token }: VerifyTokenDto): Promise<AppResult<string>> {
        try {
            let isvalidTokenResult = await this.jwtService.verifyToken(token);
            if (isvalidTokenResult.isErr()) {
                isvalidTokenResult = await this.oAuthService.verifyToken(token);
            }
            if (!isvalidTokenResult.unwrap()) {
                return AppResult.fromResult(Result.Err(new InvalidToken()));
            }
            return AppResult.fromResult(Result.Ok(isvalidTokenResult.unwrap()));
        } catch (error: any) {
            return AppResult.fromResult(Result.Err(error));
        }
    }

    private async verifyUser(userName: string, password: string): Promise<Result<boolean, Error>> {
        try {
            const user = (await this.repository.fetchByUserNameOrEmail(userName)).unwrap();
            return Result.Ok(this.encryptionService.comparePassword(password, String(user.password)).unwrap());
        } catch (error: any) {
            return Result.Err((error));
        }
    }

    async callback({ code }: AuthCodeDto): Promise<AppResult<any>> {
        try {
            const convertedTokenResult = await this.oAuthService.genrateTokenFromParam(code);
            return AppResult.fromResult(Result.Ok(convertedTokenResult.unwrap()));
        } catch (error: any) {
            return AppResult.fromResult(Result.Err(error));
        }
    }
}