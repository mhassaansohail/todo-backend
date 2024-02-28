import { Result } from "@carbonteq/fp";

export interface IEmailSender {
    sendEmail(email: string, message: string): Promise<Result<any, Error>>;
}