import { ExternalServiceFailure } from "@carbonteq/hexapp";

export class MessageSenderServiceFailure extends ExternalServiceFailure {
    constructor(operation: string) {
        super(`MessageSenderService failed while performing ${operation}.`)
    }
}