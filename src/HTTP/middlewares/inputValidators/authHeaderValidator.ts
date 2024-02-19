import { z, ZodError } from 'zod';
import { Err, Ok, Result } from 'oxide.ts';
import { ZodValidationError } from '../../controllers/inputValidators/Errors/ZodValidationError';

const authorizationHeaderSchema = z.object({
  authorization: z.string({
    required_error: "Authorization header is required",
    invalid_type_error: "Authorization header must be a string",
  }).includes("Bearer", { message: "Must include Bearer Token" }).refine((authHeader) => {
    const [, token] = authHeader.split(' ');
    return typeof token === 'string' && token !== null;
  }, {
    message: "Invalid token format",
  }).transform((header: string) => {
    return header.split(' ')[1];
  },),
});

export const validateAuthorizationHeader = (headers: any): Result<string, Error> => {
  try {
    const { authorization: token } = authorizationHeaderSchema.parse(headers);
    return Ok(token);
  } catch (error) {
    if (error instanceof ZodError) {
      return Err(new ZodValidationError(error));
    }
    return Err(new Error('Authorization header validation failed'));
  }
};
