import { ExternalServiceFailure } from "@carbonteq/hexapp";

export class EncryptionServiceFailure extends ExternalServiceFailure {
    constructor(operation: string) {
        super(`EncrptionService failed while performing ${operation}.`)
    }
}