import { z } from 'zod';
import { Result, Err, Ok } from 'oxide.ts';
import { ZodValidationError } from '../../Errors/ZodValidationError';

export const todoInputSchema = z.object({
    id: z.string({
        invalid_type_error: "Id must be a string",
    }).optional(),
    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string",
    }).min(1),
    description: z.string({
        required_error: "Description is required",
        invalid_type_error: "Description must be a string",
    }).min(1),
    completed: z.boolean({
        required_error: "completed is required",
        invalid_type_error: "completed must be a boolean",
      }),
}).strict();

export const validateTodoInput = (input: any) => {
    try {
        const todoInput = todoInputSchema.parse(input);
        return Ok(todoInput);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return Err(new ZodValidationError(error));
        }
        return Err(new Error(error.message));
    }
}