import { Result } from 'oxide.ts';
import { IEncryptionService } from '../../../Application/ports/IEncryptionService';
import bcrypt from 'bcrypt'
import { config } from '../../config';


export class BCryptEncryptionService implements IEncryptionService {
    private client: any;
    constructor() {
        this.client = bcrypt;
    }

    encryptPassword(str: string): Result<string, Error> {
        return this.client.hashSync(str, config.saltRounds)
    }

    comparePassword(password: string, encodedPassword: string): Result<boolean, Error> {
        return this.client.compareSync(password, encodedPassword);
    }
}