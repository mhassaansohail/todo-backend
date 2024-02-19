import { z } from 'zod';

export const authCodeInputSchema = z.object({
    authuser: z.string({
        invalid_type_error: "Authuser must be a string",
    }).optional(),
    hd: z.string({
        invalid_type_error: "Hd must be a string",
    }).optional(),
    prompt: z.string({
        required_error: "Prompt is required",
    }).optional(),
    scope: z.string({
        required_error: "Scope is required",
    }).optional(),
    code: z.string({
        required_error: "Code is required",
        invalid_type_error: "Code must be a string",
    }).min(1),
}).strict();