import { NotFoundError } from "@carbonteq/hexapp";

export class UserNotFoundWithParams extends NotFoundError {
    constructor(param: string, value: string) {
        super(`User with ${param}<${value}> not found.`);
      }
}