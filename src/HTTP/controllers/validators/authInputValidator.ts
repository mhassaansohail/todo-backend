import { z } from 'zod';
import { Ok, Err, Result } from 'oxide.ts';
import { ZodValidationError } from '../../Errors/ZodValidationError';

export const authInputSchema = z.object({
    userName: z.string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
    }).min(1),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }).min(1),
}).strict();


export const validateAuthInput = (input: any): Result < any, Error> => {
    try {
        const authInput = authInputSchema.parse(input);
        return Ok(authInput);
    } catch(error: any) {
        if (error instanceof z.ZodError) {
            return Err(new ZodValidationError(error));
        }
        return Err(new Error(error.message));
    }
}