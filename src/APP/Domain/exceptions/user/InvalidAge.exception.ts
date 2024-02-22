import { FieldValidationError } from "@carbonteq/hexapp";

export class InvalidAgeException extends FieldValidationError {
    constructor(field: string, value: string) {
        super(field, value, `${field} should be greater than 5.`);
    }
}