import { z } from 'zod';
import { Result, Ok, Err } from 'oxide.ts';
import { ZodValidationError } from './Errors/ZodValidationError';

export const todoPaginationOptionsInputSchema = z.object({
    pageSize: z.string({
        required_error: "Page size param is required",
        invalid_type_error: "Page size param must be a string",
    }).transform((value) => parseInt(value)).refine((value) => !isNaN(value) && value > 0, {
        message: "Invalid Page size param",
    }),
    pageNumber: z.string({
        required_error: "Page number param is required",
        invalid_type_error: "Page number param must be a string",
    }).transform((value) => parseInt(value)).refine((value) => !isNaN(value) && value > 0, {
        message: "Invalid Page number param",
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