import { z } from 'zod';
import { Result, Ok, Err } from 'oxide.ts';

export const todoIdParamSchema = z.object({
    todoId: z.string({
        required_error: "Todo id is required",
        invalid_type_error: "Todo id must be a string",
    }).min(1)
}).strict();

export const validateTodoIdParam = (input: any): Result<any, Error> => {
    try {
        return Ok(todoIdParamSchema.parse(input));
    } catch(error: any) {
        return Err(new Error(error.message));
    }
} 