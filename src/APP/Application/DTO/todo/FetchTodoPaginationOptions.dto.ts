import { z } from 'zod';
import { BaseDto, DtoValidationResult } from '@carbonteq/hexapp';
import { Result } from "@carbonteq/fp"

interface TodoConditionParams {
    title: string;
    description: string;
}

interface IFetchTodoPaginationOptions {
    pageNumber: number
    pageSize: number
    conditionParams: TodoConditionParams
}

export class FetchTodoPaginationOptionsDto extends BaseDto {
    private static readonly schema = z.object({
        pageSize: z.coerce.number().gte(1, 'Page size must greater than 0.'),
        pageNumber: z.coerce.number().gte(1, 'Page number must greater than 0.'),
        title: z.string({
            invalid_type_error: "Title must be string",
        }).optional().default(""),
        description: z.string({
            invalid_type_error: "Description must be string",
        }).optional().default(""),
    });

    constructor(readonly pageSize: number, readonly pageNumber: number, readonly title?: string, readonly description?: string) {
        super();
    }

    static create(data: unknown): DtoValidationResult<FetchTodoPaginationOptionsDto> {
        const res = BaseDto.validate<FetchTodoPaginationOptionsDto>(FetchTodoPaginationOptionsDto.schema, data);
        return res.map(({ title, description, pageNumber, pageSize }) => new FetchTodoPaginationOptionsDto(pageSize, pageNumber, title, description));
    }

    // static toApp({ pageSize, pageNumber, title, description }: FetchTodoPaginationOptionsDto): DtoValidationResult<IFetchTodoPaginationOptions> {
    //     return Result.Ok({
    //         pageNumber,
    //         pageSize,
    //         conditionParams: {
    //             title: title || "",
    //             description: description || ""
    //         }
    //     })
    // }
}