import { Ok, Err, Result } from "oxide.ts";

export interface IOAuthService {
    generateAuthURL(scopes: string[]): Promise<Result<string, Error>>
    genrateTokenFromParam(code: string): Promise<Result<any, Error>>
    verifyToken(token: any): Promise<Result<any, Error>>
}
