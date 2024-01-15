import { oAuthService } from "./index";

export class AuthService {
    
    static async login() {
        try {
            return await oAuthService.generateAuthURL(['profile', 'email']);
        } catch (error) {
            throw new Error("Invalid credentials.")
        }
    }

    static async callback(code: string) {
        try {
            return await oAuthService.getTokenFromCode(code);
        } catch (error) {
            throw new Error("Invalid code provided.")
        }
    }
}