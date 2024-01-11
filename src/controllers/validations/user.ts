import { z } from 'zod';

export const userSchema = z.object({
    id: z.string({
        invalid_type_error: "Id must be a string",
    }).optional(),
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
    }).min(1),
    username: z.string({
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
