import jwt from "jsonwebtoken"
import { Result } from "@carbonteq/fp";
import { config } from '../../config';
import { JWTServiceFailure } from "./exceptions/JWTService.exception";
import { IJWTAuthService } from "../../../Application/interfaces/IJWTAuthService";
const secretKey = String(config.jwtSecretKey);

export class JWTService implements IJWTAuthService {
    private client: any;
    constructor() {
        this.client = jwt;
    }
    genrateTokenFromParam = (userName: string): Result<string, Error> => {
        try {
            return Result.Ok(this.client.sign({ userName }, secretKey, { expiresIn: '6h' }));
        } catch (error: any) {
            return Result.Err(new JWTServiceFailure("genrateTokenFromParam"));
        }
    }

    verifyToken = (token: string): Result<any, Error> => {
        try {
            return Result.Ok(this.client.verify(token, secretKey));
        } catch (error: any) {
            return Result.Err(new JWTServiceFailure("verifyToken"));
        }

    }
}