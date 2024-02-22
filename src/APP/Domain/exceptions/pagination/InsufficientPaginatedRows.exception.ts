import { InvalidOperation } from "@carbonteq/hexapp";

export class InsufficientPaginatedRowsException extends InvalidOperation {
    constructor(message: string) {
        super(message);
    }
}