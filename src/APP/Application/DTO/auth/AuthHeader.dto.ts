import { BaseDto, DtoValidationResult } from '@carbonteq/hexapp';
import { z } from 'zod';

export class AuthHeaderDto extends BaseDto {
  private static readonly schema = z.object({
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
    },)
  });

  constructor(readonly authorization: string) {
    super();
  }

  static create(data: unknown): DtoValidationResult<AuthHeaderDto> {
    const res = BaseDto.validate<{ authorization: string }>(AuthHeaderDto.schema, data);
    return res.map(({ authorization }) => new AuthHeaderDto(authorization));
  }
}
