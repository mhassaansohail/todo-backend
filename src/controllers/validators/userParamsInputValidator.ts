import { z } from 'zod';

export const userParamsSchema = z.object({
    name: z.string().optional().default(""),
    userName: z.string().optional().default(""),
    email: z.string().optional().default(""),
});
