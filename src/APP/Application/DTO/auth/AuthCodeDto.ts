import { BaseDto, DtoValidationResult } from '@carbonteq/hexapp';
import { z } from 'zod';

export class AuthCodeDto extends BaseDto {
  private static readonly schema = z.object({
    authuser: z.string({
      invalid_type_error: "Authuser must be a string",
    }),
    hd: z.string({
      invalid_type_error: "Hd must be a string",
    }),
    prompt: z.string({
      required_error: "Prompt is required",
    }),
    scope: z.string({
      required_error: "Scope is required",
    }),
    code: z.string({
      required_error: "Code is required",
      invalid_type_error: "Code must be a string",
    }).min(1),
  })

  constructor(
    readonly authuser: string,
    readonly hd: string,
    readonly prompt: string,
    readonly scope: string,
    readonly code: string) {
    super();
  }

  static create(data: unknown): DtoValidationResult<AuthCodeDto> {
    const res = BaseDto.validate
      <{
        authuser: string,
        hd: string,
        prompt: string,
        scope: string,
        code: string
      }>(AuthCodeDto.schema, data);
    return res.map(({ authuser, hd, prompt, scope, code }) => new AuthCodeDto(authuser, hd, prompt, scope, code));
  }
}