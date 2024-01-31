import { Ok, Err } from "oxide.ts";

export interface IOAuthService {
    generateAuthURL(scopes: string[]): Promise<Err<Error> | Ok<string>>
    genrateTokenFromParam(code: string): Promise<Err<Error> | Ok<any>>
    verifyToken(token: any): Promise<Err<Error> | Ok<any>>
}
