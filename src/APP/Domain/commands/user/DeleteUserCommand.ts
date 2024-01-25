import { Command } from "../Command";

export class DeleteUserCommand implements Command {
    private userId: string;
    
    constructor(userId: string) {
        this.userId = userId;
    }

    getDetails(): Record<string, string> {
        return { userId: this.userId }
    }
}