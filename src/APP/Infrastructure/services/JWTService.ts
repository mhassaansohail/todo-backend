import { IJWTAuthService } from "../../Application/contracts/IJWTAuthService";
import jwt from "jsonwebtoken"
import { Err, Ok, Result } from "oxide.ts";
const secretKey = String(process.env.SECRET_KEY);

export class JWTService implements IJWTAuthService {
    private client: any;
    constructor() {
        this.client = jwt;
    }
    genrateTokenFromParam = (userName: string): Result<string, Error> => {
        try {
            return Ok(this.client.sign({ userName }, secretKey, { expiresIn: '6h' }));
        } catch (error: any) {
            return Err(new Error(error.message))
        }
    }

    verifyToken = (token: string): Result<any, Error> => {
        try {
            return Ok(this.client.verify(token, secretKey));
        } catch (error: any) {
            return Err(new Error(error.message))
        }

    }
}