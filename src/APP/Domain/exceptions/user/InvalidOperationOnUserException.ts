import { InvalidOperation } from '@carbonteq/hexapp';

export class InvalidOperationOnUser extends InvalidOperation {
    constructor() {
      super(`Invalid Operation on User`);
    }
}