import { ValidationError } from "@carbonteq/hexapp";

export class PaginationOptionsException extends ValidationError {
    constructor(message: string) {
        super(message);
    }
}