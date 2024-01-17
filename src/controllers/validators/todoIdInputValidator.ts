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
        const idParam = todoIdParamSchema.parse(input);
        return Ok(idParam);
    } catch(error) {
        return Err(new Error("Id param validation failed."));
    }
} 