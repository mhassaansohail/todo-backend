import { inject, injectable } from "tsyringe";
import { Result } from "@carbonteq/fp";
import { INotificationSender } from "../../interfaces/INotificationSender";


@injectable()
export class NotificationService {
    private notificationSender: INotificationSender;
    constructor(@inject("NotificationSender") notificationSender: INotificationSender) {
        this.notificationSender = notificationSender;
    }

    async sendNotification(message: string): Promise<Result<any, Error>> {
        try {
            await this.notificationSender.send(message);
            return Result.Ok(undefined);
        } catch (error: any) {
            return Result.Err(new Error(error.message))
        }
    }
}