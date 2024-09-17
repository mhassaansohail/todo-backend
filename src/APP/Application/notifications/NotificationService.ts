import User from "../../Domain/entities/User";
import { inject, injectable } from "tsyringe";
import { IMessageSender } from "../ports/IMessageSender";
import { IEmailSender } from "../ports/IEmailSender";
import { Result } from "@carbonteq/fp";

@injectable()
export class NotificationService {
    private emailSender: IEmailSender;
    private messageSender: IMessageSender;
    constructor(@inject("EmailSender") emailSender: IEmailSender, @inject("MessageSender") messageSender: IMessageSender) {
        this.emailSender = emailSender;
        this.messageSender = messageSender;
    }

    private async sendEmail(email: string, message: string): Promise<Result<any, Error>> {
        try {
            const response = await this.emailSender.sendEmail(email, message)
            return Result.Ok(response.unwrap());
        } catch (error: any) {
            return Result.Err(new Error(error.message))
        }
    }

    private async sendMessage(message: string): Promise<Result<any, Error>> {
        try {
            const response = await this.messageSender.sendMessage(message)
            return Result.Ok(response.unwrap());
        } catch (error: any) {
            return Result.Err(new Error(error.message))
        }
    }

    async sendNotifications(users: User[], message: string): Promise<Result<undefined, Error>> {
        try {
            await this.sendMessage(message);
            for (const user of users) {
                await this.sendEmail(user.email, message);
            }
            return Result.Ok(undefined);
        } catch (error: any) {
            return Result.Err(new Error(error.message))
        }
    }
}