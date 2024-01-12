import { z } from 'zod';

export const todoIdParamSchema = z.object({
    todoId: z.string({
        required_error: "Todo id is required",
        invalid_type_error: "Todo id must be a string",
    }).min(1)
}).strict();