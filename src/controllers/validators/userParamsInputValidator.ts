import { z } from 'zod';

export const userParamsSchema = z.object({
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
