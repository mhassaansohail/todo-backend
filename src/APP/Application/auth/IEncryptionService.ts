export interface IEncryptionService {
    encryptPassword(str: string): string;
    comparePassword(password: string, encodedPassword: string): boolean
}