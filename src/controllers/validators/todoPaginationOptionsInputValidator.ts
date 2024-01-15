import { z } from 'zod';

export const todoPaginationOptionsInputSchema = z.object({
    offset: z.string({
        required_error: "Offset is required",
        invalid_type_error: "Offset must be string",
    }).transform((value) => parseInt(value)).refine((value) => !isNaN(value) && value >= 0, {
        message: "Invalid Offset",
    }),
    pageSize: z.string({
        required_error: "Page size is required",
        invalid_type_error: "Page size per page must be a string",
    }).transform((value) => parseInt(value, 10)).refine((value) => !isNaN(value) && value > 0, {
        message: "Invalid Page size",
    }),
    title: z.string({
        invalid_type_error: "Title must be string",
    }).optional().default(""),
    description: z.string({
        invalid_type_error: "Description must be string",
    }).optional().default(""),
});
