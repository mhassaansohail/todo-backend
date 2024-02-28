import { InvalidOperation } from '@carbonteq/hexapp';

export class InvalidOperationOnTodo extends InvalidOperation {
    constructor() {
      super(`Invalid Operation on Todo`);
    }
}