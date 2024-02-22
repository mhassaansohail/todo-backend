import { AlreadyExistsError } from '@carbonteq/hexapp';

export class TodoAlreadyExists extends AlreadyExistsError {
  constructor(todoId: string) {
    super(`Todo with todoId<${todoId}> already exists in DB`);
  }
}