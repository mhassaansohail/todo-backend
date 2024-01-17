import { z } from 'zod';
import { Ok, Err } from 'oxide.ts';

export const userInputSchema = z.object({
    id: z.string({
        invalid_type_error: "Id must be a string",
    }).optional(),
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
    }).min(1),
    userName: z.string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
    }).min(1),
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    }).email().min(1),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }).min(1),
    age: z.number({
        required_error: "Age is required",
        invalid_type_error: "Age must be a number",
    }).positive(),
}).strict();

export const validateUserInput = (input: any) => {
    try {
        const userInput = userInputSchema.parse(input);
        return Ok(userInput);
    } catch (error) {
        return Err("User input validation failed.");
    }
}