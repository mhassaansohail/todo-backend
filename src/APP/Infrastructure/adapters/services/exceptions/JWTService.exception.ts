import { ExternalServiceFailure } from "@carbonteq/hexapp";

export class JWTServiceFailure extends ExternalServiceFailure {
    constructor(operation: string) {
        super(`JWTService failed while performing ${operation}.`)
    }
}