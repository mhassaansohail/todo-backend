import nodeMailer, { Transporter } from "nodemailer"
// import pLimit from "p-limit";
import { Result } from "@carbonteq/fp";
import { EmailServiceFailure } from "./exceptions/EmailService.exception";
import { INotificationSender } from "../../../Application/interfaces/INotificationSender";
import { config } from "../../config";

interface EmailConfig {
    sender: string;
    receiver: string;
    pass: string;
    service: string;
    retryAttempts: number;
    concurrencyLimit: number;
}

const emailConfig: EmailConfig = {
    sender: String(config.emailSender),
    receiver: String(config.emailReceiver),
    pass: String(config.emailPass),
    service: String(config.emailService),
    retryAttempts: Number(config.retryAttempts),
    concurrencyLimit: Number(config.concurrencyLimit)
}

export class EmailSender implements INotificationSender {
    transporter: Transporter;
    // limit: any;
    constructor() {
        this.transporter = nodeMailer.createTransport({
            service: emailConfig.service,
            auth: {
                user: emailConfig.sender,
                pass: emailConfig.pass
            }
        });
        // this.limit = pLimit(emailConfig.concurrencyLimit);
    }
    async send(message: string): Promise<Result<any, Error>> {
        try {
            return Result.Ok(await this.sendEmail(message, emailConfig.retryAttempts)).unwrap();
            // return Result.Ok(this.limit(async () => (await this.sendEmail(message, emailConfig.retryAttempts)).unwrap()));
        } catch (error: any) {
            return Result.Err(error);
        }
    }

    private async sendEmail(message: string, attemptsLeft: number): Promise<Result<any, Error>> {
        try {
            const mailOptions = {
                from: emailConfig.sender,
                to: emailConfig.receiver,
                html: `<p>${message}</p>`
            };
            return await this.transporter.sendMail(mailOptions);
        } catch (error: any) {
            if (attemptsLeft > 0) {
                return Result.Ok(this.sendEmail(message, attemptsLeft - 1));
            } else {
                return Result.Err(new EmailServiceFailure("sendingMail"));
            }
        }
    }
}