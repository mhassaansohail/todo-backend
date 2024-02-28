import { BaseDto, DtoValidationResult } from '@carbonteq/hexapp';
import { z } from 'zod';

export class UserIdDto extends BaseDto {
    private static readonly schema = z.object({
        userId: z.string({
            required_error: "User id is required",
            invalid_type_error: "User id must be a string",
        }).min(1)
    }).strict();

    constructor(readonly userId: string) {
        super();
    }

    static create(data: unknown): DtoValidationResult<UserIdDto> {
        const res = BaseDto.validate<{ userId: string}>(UserIdDto.schema, data);
        return res.map(({ userId}) => new UserIdDto(userId));
    }
}