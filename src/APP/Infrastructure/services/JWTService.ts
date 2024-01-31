import { IJWTAuthService } from "../../Application/contracts/IJWTAuthService";
import jwt from "jsonwebtoken"
import { Err, Ok } from "oxide.ts";
const secretKey = String(process.env.SECRET_KEY);

export class JWTService implements IJWTAuthService {
    private client: any;
    constructor() {
        this.client = jwt;
    }
    genrateTokenFromParam = (userName: string): Ok<string> | Err<Error> => {
        try {
            return Ok(this.client.sign({ userName }, secretKey, { expiresIn: '6h' }));
        } catch (error: any) {
            return Err(new Error(error.message))
        }
    }

    verifyToken = (token: string): Ok<any> | Err<Error> => {
        try {
            return Ok(this.client.verify(token, secretKey));
        } catch (error: any) {
            return Err(new Error(error.message))
        }

    }
}