import { IEncryptionService } from '../../Application/contracts/IEncryptionService';
import bcrypt from 'bcrypt'
const saltRounds = String(process.env.SALT_ROUNDS);


export class BCryptEncryptionService implements IEncryptionService {
    private client: any;
    constructor() {
        this.client = bcrypt;
    }

    encryptPassword (str: string): string {
        return this.client.hashSync(str, saltRounds)
    }
    
    comparePassword (password: string, encodedPassword: string): boolean {
        return this.client.compareSync(password, encodedPassword);
    }
}