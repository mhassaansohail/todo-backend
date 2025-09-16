import { BaseDto, DtoValidationResult } from '@carbonteq/hexapp';
import { z } from 'zod';

export class LoginDto extends BaseDto {
    private static readonly schema = z.object({
        userName: z.string({
            required_error: "Username is required",
            invalid_type_error: "Username must be a string",
        }),
        password: z.string({
            required_error: "Password is required",
            invalid_type_error: "Password must be a string",
        }),
    }).refine((schema) =>
        (schema.password && schema.userName) || (!schema.password && !schema.userName), {
        message: "For login either both credentials, userName and password, should be present or none of them."
    });

    constructor(readonly userName: string, readonly password: string) {
        super();
    }

    static create(data: unknown): DtoValidationResult<LoginDto> {
        const res = BaseDto.validate<{ readonly userName: string, readonly password: string }>(LoginDto.schema, data);
        return res.map(({ userName, password }) => new LoginDto(userName, password));
    }
}