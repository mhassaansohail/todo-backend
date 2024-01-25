import { z } from 'zod';

export const todoParamsSchema = z.object({
    title: z.string({
        invalid_type_error: "Title must be string",
    }).optional().default(""),
    description: z.string({
        invalid_type_error: "Description must be string",
    }).optional().default(""),
}).strict();
