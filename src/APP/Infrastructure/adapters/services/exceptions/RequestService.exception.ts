import { ExternalServiceFailure } from "@carbonteq/hexapp";

export class RequestServiceFailure extends ExternalServiceFailure {
    constructor(operation: string) {
        super(`RequestService failed while performing ${operation}.`)
    }
}