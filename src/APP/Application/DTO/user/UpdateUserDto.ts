import { BaseDto, DtoValidationResult } from '@carbonteq/hexapp';
import { z } from 'zod';
import { Result } from "@carbonteq/fp"

interface IUpdateUser {
    readonly userId: string,
    readonly name: string,
    readonly userName: string,
    readonly email: string,
    readonly password: string,
    readonly age: number

}

export class UpdateUserDto extends BaseDto {
    private static readonly schema = z.object({
        userId: z.string({
            required_error: "UserId is required",
            invalid_type_error: "UserId must be a string",
        }).min(1),
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

    constructor(readonly userId: string, readonly name: string, readonly userName: string, readonly email: string, readonly password: string, readonly age: number) {
        super();
    }

    static create(data: unknown): DtoValidationResult<UpdateUserDto> {
        const res = BaseDto.validate<{ userId: string, name: string, userName: string, email: string, password: string, age: number }>(UpdateUserDto.schema, data);
        return res.map(({ userId, name, userName, email, password, age }) => new UpdateUserDto(userId, name, userName, email, password, age));
    }
    // static toApp({ userId, name, userName, email, password, age }: IUpdateUser): DtoValidationResult<IUpdateUser> {
    //     return Result.Ok({ userId, name, userName, email, password, age });
    // }
}
