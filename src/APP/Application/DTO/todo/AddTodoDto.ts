import { BaseDto, DtoValidationResult } from '@carbonteq/hexapp';
import { z } from 'zod';

export class AddTodoDto extends BaseDto {
    private static readonly schema = z.object({
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

    constructor(readonly title: string, readonly description: string, readonly completed: boolean) {
        super();
    }

    static create(data: unknown): DtoValidationResult<AddTodoDto> {
        const res = BaseDto.validate<
        { readonly title: string, readonly description: string, readonly completed: boolean }
        >(AddTodoDto.schema, data);
        return res.map(({ title, description, completed }) => new AddTodoDto(title, description, completed));
    }
}