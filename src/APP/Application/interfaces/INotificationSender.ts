import { Result } from "@carbonteq/fp";

export interface INotificationSender {
    send(message: string): Promise<Result<any, Error>>;
}