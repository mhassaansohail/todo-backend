import { boolean, z } from 'zod';

export const todoParamsSchema = z.object({
    title: z.string().optional().default(""),
    description: z.string().optional().default(""),
    completed: z.string().transform((val) => val === 'true')
}).strict();
