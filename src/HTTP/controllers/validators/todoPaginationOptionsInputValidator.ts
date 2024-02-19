import { z } from 'zod';
import { Result, Ok, Err } from 'oxide.ts';
import { ZodValidationError } from '../../Errors/ZodValidationError';

export const todoPaginationOptionsInputSchema = z.object({
    offset: z.string({
        required_error: "Offset is required",
        invalid_type_error: "Offset must be string",
    }).transform((value) => parseInt(value)).refine((value) => !isNaN(value) && value >= 0, {
        message: "Invalid Offset",
    }),
    limit: z.string({
        required_error: "Limit is required",
        invalid_type_error: "Limit must be a string",
    }).transform((value) => parseInt(value, 10)).refine((value) => !isNaN(value) && value > 0, {
        message: "Invalid Limit",
    }),
    title: z.string({
        invalid_type_error: "Title must be string",
    }).optional().default(""),
    description: z.string({
        invalid_type_error: "Description must be string",
    }).optional().default(""),
});


export const validateTodoPaginationOptions = (input: any): Result<any, Error> => {
    try {
        const searchParams = todoPaginationOptionsInputSchema.parse(input);
        return Ok(searchParams);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return Err(new ZodValidationError(error));
        }
        return Err(new Error(error.message));
    }
}