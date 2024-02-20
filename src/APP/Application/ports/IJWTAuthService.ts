import { Result } from "@carbonteq/fp";

export interface IJWTAuthService {
    genrateTokenFromParam(userName: string): Result<string, Error>;
    verifyToken(token: string): Result<any, Error>;
}