import { Err, Ok, Result } from "oxide.ts";

export interface IJWTAuthService {
    genrateTokenFromParam(userName: string): Result<string, Error>;
    verifyToken(token: string): Result<any, Error>;
}