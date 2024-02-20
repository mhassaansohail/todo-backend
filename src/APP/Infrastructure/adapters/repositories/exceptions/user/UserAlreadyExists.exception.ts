import { AlreadyExistsError } from "@carbonteq/hexapp";

export class UserAlreadyExists extends AlreadyExistsError {
    constructor(userId: string) {
      super(`User with userId<${userId}> already exists in DB`);
    }
  }