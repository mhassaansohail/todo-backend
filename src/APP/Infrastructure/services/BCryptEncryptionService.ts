import { Result } from 'oxide.ts';
import { IEncryptionService } from '../../Application/contracts/IEncryptionService';
import bcrypt from 'bcrypt'
const saltRounds = String(process.env.SALT_ROUNDS);


export class BCryptEncryptionService implements IEncryptionService {
    private client: any;
    constructor() {
        this.client = bcrypt;
    }

    encryptPassword (str: string): Result<string, Error> {
        return this.client.hashSync(str, saltRounds)
    }
    
    comparePassword (password: string, encodedPassword: string): Result<boolean, Error> {
        return this.client.compareSync(password, encodedPassword);
    }
}