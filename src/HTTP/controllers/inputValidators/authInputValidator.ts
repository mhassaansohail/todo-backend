import { z } from 'zod';
import { Ok, Err, Result } from 'oxide.ts';
import { ZodValidationError } from './Errors/ZodValidationError';

export const authInputSchema = z.object({
    userName: z.string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
    }).optional(),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }).optional(),
}).refine((schema) =>
    (schema.password && schema.userName) || (!schema.password && !schema.userName), {
    message: "For login either both credentials, userName and password, should be present or none of them."
});


export const validateAuthInput = (input: any): Result<any, Error> => {
    try {
        const authInput = authInputSchema.parse(input);
        return Ok(authInput);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return Err(new ZodValidationError(error));
        }
        return Err(new Error(error.message));
    }
}