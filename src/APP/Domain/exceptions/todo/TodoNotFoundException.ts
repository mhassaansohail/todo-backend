import { NotFoundError } from '@carbonteq/hexapp';

export class TodoNotFound extends NotFoundError {
  constructor(todoId: string) {
    super(`Todo with todoId<${todoId}> not found.`);
  }
}
