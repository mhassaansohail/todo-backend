import { z } from 'zod';

export const userIdParamSchema = z.object({
    userId: z.string({
        required_error: "User id is required",
        invalid_type_error: "User id must be a string",
    }).min(1)
}).strict();