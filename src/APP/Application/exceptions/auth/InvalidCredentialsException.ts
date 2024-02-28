import { UnauthorizedOperation } from "@carbonteq/hexapp";

export class InvalidCredentials extends UnauthorizedOperation {
    constructor() {
        super("User has provided invalid credentials.");
    }
}