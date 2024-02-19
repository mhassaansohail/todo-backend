import { Result } from "oxide.ts";

export interface IEncryptionService {
    encryptPassword(str: string): Result<string, Error>;
    comparePassword(password: string, encodedPassword: string): Result<boolean, Error>
}