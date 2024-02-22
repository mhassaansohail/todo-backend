import { DtoValidationResult } from '@carbonteq/hexapp';
import { Result } from '@carbonteq/fp';

interface IVerifyToken {
    token: string;
}

export class VerifyTokenDto implements IVerifyToken {
    readonly token: string;
    constructor(token: string) {
        this.token = token
    }

    static create(data: string): DtoValidationResult<IVerifyToken> {
        const res = Result.Ok<IVerifyToken>({ token: data })
        return res.map(({ token }) => new VerifyTokenDto(token));
    }
}