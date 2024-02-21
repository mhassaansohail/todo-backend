import { inject, injectable } from 'tsyringe';
import { Result } from "@carbonteq/fp";
import { IMessageSender } from "../../../Application/ports/IMessageSender";
import { IRequestService } from '../../../Application/ports/IRequestService';
import { config } from 'APP/Infrastructure/config';

const webhookUrl: string = String(config.slackWebhookURL);

@injectable()
export class SlackMessageSender implements IMessageSender {
    requestService: IRequestService;
    constructor(@inject("RequestService") requestService: IRequestService) {
        this.requestService = requestService;
    }
    async sendMessage(message: string): Promise<Result<any, Error>> {
        try {
            const payload = {
                text: message,
            };
            const response = await this.requestService.makePostRequest(webhookUrl, payload);
            return Result.Ok(response.unwrap());
        } catch (error: any) {
            return Result.Err(new Error(error.message));
        }
    }
}