import { Result } from "@carbonteq/fp";
import { IEncryptionService } from '../../../Application/ports/IEncryptionService';
import bcrypt from 'bcrypt'
import { config } from '../../config';
import { EncryptionServiceFailure } from "./exceptions/EncryptionService.exception";


export class BCryptEncryptionService implements IEncryptionService {
    private client: any;
    constructor() {
        this.client = bcrypt;
    }

    encryptPassword(str: string): Result<string, Error> {
        try {
            return Result.Ok(this.client.hashSync(str, parseInt(String(config.saltRounds))))
        } catch (error) {
            return Result.Err(new EncryptionServiceFailure("encryptPassword"));
        }
    }

    comparePassword(password: string, encodedPassword: string): Result<boolean, Error> {
        try {
            return Result.Ok(this.client.compareSync(password, encodedPassword));
        } catch (error) {
            return Result.Err(new EncryptionServiceFailure("comparePassword"));
        }
    }
}