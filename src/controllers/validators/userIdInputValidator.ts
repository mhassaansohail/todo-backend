import { z } from 'zod';
import { Err, Ok, Result } from 'oxide.ts';

export const userIdParamSchema = z.object({
    userId: z.string({
        required_error: "User id is required",
        invalid_type_error: "User id must be a string",
    }).min(1)
}).strict();

export const validateUserIdParam = (input: any): Result<any, Error> => {
    try {
        const todoIdParam = userIdParamSchema.parse(input);
        return Ok(todoIdParam);
    } catch (error) {
        return Err(new Error("Todo id param validation failed."));
    }
}