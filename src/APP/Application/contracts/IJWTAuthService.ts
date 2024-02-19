import { Err, Ok } from "oxide.ts";

export interface IJWTAuthService {
    genrateTokenFromParam(userName: string): Ok<string> | Err<Error>;
    verifyToken(token: string): Ok<any> | Err<Error>;
}