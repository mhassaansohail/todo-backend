import { z } from 'zod';
import { Result, Ok, Err } from 'oxide.ts';
import { ZodValidationError } from '../../Errors/ZodValidationError';

export const userPaginationOptionsInputSchema = z.object({
    pageSize: z.string({
        required_error: "Page size param is required",
        invalid_type_error: "Page size param must be a string",
    }).transform((value) => parseInt(value)).refine((value) => !isNaN(value) && value > 0, {
        message: "Invalid Page size param",
    }),
    pageNumber: z.string({
        required_error: "Page number param is required",
        invalid_type_error: "Page number param must be a string",
    }).transform((value) => parseInt(value, 10)).refine((value) => !isNaN(value) && value > 0, {
        message: "Invalid Page number param",
    }),
    name: z.string({
        invalid_type_error: "Name must be a string",
    }).optional().default(""),
    userName: z.string({
        invalid_type_error: "Username must be a string",
    }).optional().default(""),
    email: z.string({
        invalid_type_error: "Email must be a string",
    }).optional().default(""),
});

export const validateUserPaginationOptions = (input: any): Result<any, Error> => {
    try {
        const searchParams = userPaginationOptionsInputSchema.parse(input);
        return Ok(searchParams);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return Err(new ZodValidationError(error));
        }
        return Err(new Error(error.message));
    }
}