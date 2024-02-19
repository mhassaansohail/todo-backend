import { z } from 'zod';
import { Err, Ok, Result } from 'oxide.ts';
import { ZodValidationError } from './Errors/ZodValidationError';

export const userIdParamSchema = z.object({
    userId: z.string({
        required_error: "User id is required",
        invalid_type_error: "User id must be a string",
    }).min(1)
}).strict();

export const validateUserIdParam = (input: any): Result<any, Error> => {
    try {
        
        return Ok(userIdParamSchema.parse(input));
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return Err(new ZodValidationError(error));
        }
        return Err(new Error(error.message));
    }
}