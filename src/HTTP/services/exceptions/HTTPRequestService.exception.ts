import { ExternalServiceFailure } from "@carbonteq/hexapp";

export class HTTPRequestServiceFailure extends ExternalServiceFailure {
    constructor(operation: string) {
        super(`HTTPRequestService failed while performing ${operation}.`)
    }
}