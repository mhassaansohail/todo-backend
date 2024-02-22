import { BaseDto, DtoValidationResult } from '@carbonteq/hexapp';
import { z } from 'zod';

export class CreateUserDto extends BaseDto {
    private static readonly schema = z.object({
        name: z.string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        }).min(1),
        userName: z.string({
            required_error: "Username is required",
            invalid_type_error: "Username must be a string",
        }).min(1),
        email: z.string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string",
        }).email().min(1),
        password: z.string({
            required_error: "Password is required",
            invalid_type_error: "Password must be a string",
        }).min(1),
        age: z.number({
            required_error: "Age is required",
            invalid_type_error: "Age must be a number",
        }),
    }).strict();

    constructor(readonly name: string, readonly userName: string, readonly email: string, readonly password: string, readonly age: number) {
        super();
    }

    static create(data: unknown): DtoValidationResult<CreateUserDto> {
        const res = BaseDto.validate<{ name: string, userName: string, email: string, password: string, age: number }>(CreateUserDto.schema, data);
        return res.map(({ name, userName, email, password, age }) => new CreateUserDto(name, userName, email, password, age));
    }
}
