import { Ok, Err } from "oxide.ts";
import { UserRepository } from "../../Domain/repositories/UserRepository";
import { inject, injectable } from "tsyringe";
import { IJWTAuthService } from "../contracts/IJWTAuthService";
import { IOAuthService } from "../contracts/IOAuthService";
import { IEncryptionService } from "../contracts/IEncryptionService";
import { Credentials } from "../../Domain/valueObjects/user/Credentials";

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

    async loginWithOAuth(): Promise<Ok<string> | Err<Error>> {
        try {
            const consentScreenUrlResult = await this.oAuthService.generateAuthURL(['profile', 'email']);
            // if (consentScreenUrlResult.isErr()) {
            //     const { message } = consentScreenUrlResult.unwrapErr();
            //     return Err(new Error(message));
            // }
            return Ok(consentScreenUrlResult.unwrap())
        } catch (error) {
            return Err(new Error("Invalid credentials."));
        }
    }

    async loginByCredentials(userName: string, password: string): Promise<Ok<string> | Err<Error>> {
        try {
            const userCredentials = new Credentials(userName, password);
            const isValidUserResult = await this.verifyUser(userCredentials._username, userCredentials._password);
            // if (isValidUserResult.isErr()) {
            //     const { message } = isValidUserResult.unwrapErr();
            //     return Err(new Error(message));
            // }
            if (!isValidUserResult.unwrap()) {
                return Err(new Error("Invalid username or password."));
            }
            const tokenResult = await this.jwtService.genrateTokenFromParam(userName);
            // if (tokenResult.isErr()) {
            //     const { message } = tokenResult.unwrapErr()
            //     return Err(new Error(message));
            // }
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
                // if (isvalidTokenResult.isErr()) {
                //     let { message } = isvalidTokenResult.unwrapErr();
                //     return Err(new Error(message));
                // }
            }
            return Ok(isvalidTokenResult.unwrap());
        } catch (error) {
            return Err(new Error("Invalid token."));
        }
    }

    private async verifyUser(userName: string, password: string): Promise<Ok<boolean> | Err<Error>> {
        try {
            const user = await this.repository.fetchByUserNameOrEmail(userName);
            return Ok(this.encryptionService.comparePassword(password, String(user?._password)));
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }

    async callback(code: string): Promise<Ok<any> | Err<Error>> {
        try {
            const convertedTokenResult = await this.oAuthService.genrateTokenFromParam(code);
            // if (convertedTokenResult.isErr()) {
            //     const { message } = convertedTokenResult.unwrapErr();
            //     return Err(new Error(message));
            // }
            return Ok(convertedTokenResult.unwrap());
        } catch (error: any) {
            return Err(new Error(error.message));
        }
    }
}