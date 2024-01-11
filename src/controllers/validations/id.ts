import { z } from 'zod';

export const idSchema = z.object({
    id: z.string({
        required_error: "Id is required",
        invalid_type_error: "Id must be a string",
    }).min(1)
}).strict();