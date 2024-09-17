import { NotFoundError } from "@carbonteq/hexapp";

export class UserNotFound extends NotFoundError {
  constructor(userId: string) {
    super(`User with userId<${userId}> not found`);
  }
}