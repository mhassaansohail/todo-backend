import { BaseDto, DtoValidationResult } from '@carbonteq/hexapp';
import { z } from 'zod';

export class UpdateTodoDto extends BaseDto {
    private static readonly schema = z.object({
        todoId: z.string({
            invalid_type_error: "Id must be a string",
        }),
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

    constructor(readonly todoId: string, readonly title: string, readonly description: string, readonly completed: boolean) {
        super();
    }

    static create(data: unknown): DtoValidationResult<UpdateTodoDto> {
        const res = BaseDto.validate<
        { readonly todoId: string, readonly title: string, readonly description: string, readonly completed: boolean }
        >(UpdateTodoDto.schema, data);
        return res.map(({ todoId, title, description, completed }) => new UpdateTodoDto(todoId, title, description, completed));
    }
}