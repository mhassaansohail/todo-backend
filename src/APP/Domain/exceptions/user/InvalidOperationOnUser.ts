import { AlreadyExistsError, InvalidOperation, NotFoundError } from '@carbonteq/hexapp';

export class UserNotFound extends NotFoundError {
  constructor(userId: string) {
    super(`User with userId<${userId}> not found`);
  }
}

export class UserAlreadyExists extends AlreadyExistsError {
  constructor(userId: string) {
    super(`User with userId<${userId}> already exists in DB`);
  }
}

export class InvalidOperationOnUser extends InvalidOperation {
    constructor() {
      super(`Invalid Operation on User`);
    }
}