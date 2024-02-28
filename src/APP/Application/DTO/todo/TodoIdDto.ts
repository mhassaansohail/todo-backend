import { BaseDto, DtoValidationResult } from '@carbonteq/hexapp';
import { z } from 'zod';

export class TodoIdDto extends BaseDto {
    private static readonly schema = z.object({
        todoId: z.string({
            required_error: "Todo id is required",
            invalid_type_error: "Todo id must be a string",
        }).min(1)
    }).strict();

    constructor(readonly todoId: string) {
        super();
    }

    static create(data: unknown): DtoValidationResult<TodoIdDto> {
        const res = BaseDto.validate<{ readonly todoId: string }>(TodoIdDto.schema, data);
        return res.map(({ todoId }) => new TodoIdDto(todoId));
    }
}
