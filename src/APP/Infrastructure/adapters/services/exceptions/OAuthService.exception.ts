import { ExternalServiceFailure } from "@carbonteq/hexapp";

export class OAuthServiceFailure extends ExternalServiceFailure {
    constructor(operation: string) {
        super(`OAuthService failed while performing ${operation}.`)
    }
}