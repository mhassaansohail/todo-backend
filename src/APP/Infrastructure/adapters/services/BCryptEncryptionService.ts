import { Result } from "@carbonteq/fp";
import { IEncryptionService } from '../../../Application/ports/IEncryptionService';
import bcrypt from 'bcrypt'
import { config } from '../../config';


export class BCryptEncryptionService implements IEncryptionService {
    private client: any;
    constructor() {
        this.client = bcrypt;
    }

    encryptPassword(str: string): Result<string, Error> {
        return Result.Ok(this.client.hashSync(str, config.saltRounds))
    }

    comparePassword(password: string, encodedPassword: string): Result<boolean, Error> {
        return Result.Ok(this.client.compareSync(password, encodedPassword));
    }
}