import nodeMailer, { Transporter } from "nodemailer"
import { IEmailSender } from "../../../Application/ports/IEmailSender";
import { Result } from "@carbonteq/fp";

interface EmailConfig {
    user: string;
    pass: string;
}

const emailConfig: EmailConfig = {
    user: String(process.env.EMAIL_USER),
    pass: String(process.env.EMAIL_PASS)
}

export class EmailSender implements IEmailSender {
    transporter: Transporter;
    constructor() {
        this.transporter = nodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: emailConfig.user,
                pass: emailConfig.pass
            }
        });
    }
    async sendEmail(email: string, message: string): Promise<Result<any, Error>> {
        const mailOptions = {
            from: emailConfig.user,
            to: email,
            html: `<p>${message}</p>`
        }
        try {
            return Result.Ok(await this.transporter.sendMail(mailOptions));
        } catch (error: any) {
            return Result.Err(new Error(error.message))
        }
    }
}