import { ExternalServiceFailure } from "@carbonteq/hexapp";

export class EmailServiceFailure extends ExternalServiceFailure {
    constructor(operation: string) {
        super(`EmailService failed while performing ${operation}.`)
    }
}