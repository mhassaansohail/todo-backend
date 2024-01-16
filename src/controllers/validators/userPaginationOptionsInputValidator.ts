import { z } from 'zod';

export const userPaginationOptionsInputSchema = z.object({
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
    name: z.string({
        invalid_type_error: "Name must be string",
    }).optional().default(""),
    userName: z.string({
        invalid_type_error: "Username must be string",
    }).optional().default(""),
    email: z.string({
        invalid_type_error: "Email must be string",
    }).optional().default(""),
});
