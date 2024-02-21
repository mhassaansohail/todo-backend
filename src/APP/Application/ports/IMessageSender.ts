import { Result } from "@carbonteq/fp";

export interface IMessageSender {
    sendMessage(message: string): Promise<Result<any, Error>>;
}