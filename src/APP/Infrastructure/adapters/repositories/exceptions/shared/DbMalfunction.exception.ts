import { ExternalServiceFailure } from '@carbonteq/hexapp';

export class DbMalfunction extends ExternalServiceFailure {
  constructor(operation: string) {
    super(`DB malfunctioned on operation ${operation}.`);
  }
}