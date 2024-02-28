import { UnauthorizedOperation } from "@carbonteq/hexapp";

export class InvalidToken extends UnauthorizedOperation {
    constructor() {
        super("User has provided invalid authorization token.");
    }
}