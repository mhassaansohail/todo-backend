import { AlreadyExistsError } from "@carbonteq/hexapp";

export class UserAlreadyExists extends AlreadyExistsError {
    constructor(property: string, value: string) {
      super(`User with ${property}:${value}> already exists in DB`);
    }
  }