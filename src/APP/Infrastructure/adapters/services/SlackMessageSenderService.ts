import { inject, injectable } from 'tsyringe';
import { Result } from "@carbonteq/fp";
import { HTTPRequestService } from '../../../Application/interfaces/HTTPRequestService';
import { config } from '../../config';
import { MessageSenderServiceFailure } from './exceptions/MessageSenderService.exception';
import { INotificationSender } from '../../../Application/interfaces/INotificationSender';

const webhookUrl: string = String(config.slackWebhookURL);

@injectable()
export class SlackMessageSender implements INotificationSender {
    requestService: HTTPRequestService;
    constructor(@inject("RequestService") requestService: HTTPRequestService) {
        this.requestService = requestService;
    }
    async send(message: string): Promise<Result<any, Error>> {
        try {
            return Result.Ok((await this.sendMessage(message)).unwrap());
        } catch (error: any) {
            return Result.Err(error);
        }
    }

    

    private async sendMessage(message: string): Promise<Result<any, Error>> {
        try {
            const payload = {
                text: message,
            };
            const response = await this.requestService.makePostRequest(webhookUrl, payload);
            return Result.Ok(response.unwrap());
        } catch (error: any) {
            return Result.Err(new MessageSenderServiceFailure("sendMessage"));
        }
    }
}