import { AlreadyExistsError, InvalidOperation, NotFoundError } from '@carbonteq/hexapp';

export class TodoNotFound extends NotFoundError {
  constructor(todoId: string) {
    super(`Todo with todoId<${todoId}> not found`);
  }
}

export class TodoAlreadyExists extends AlreadyExistsError {
  constructor(todoId: string) {
    super(`Todo with todoId<${todoId}> already exists in DB`);
  }
}

export class InvalidOperationOnTodo extends InvalidOperation {
    constructor() {
      super(`Invalid Operation on Todo`);
    }
}