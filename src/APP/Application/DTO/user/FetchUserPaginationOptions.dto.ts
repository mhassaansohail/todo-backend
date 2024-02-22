import { BaseDto, DtoValidationResult } from '@carbonteq/hexapp';
import { z } from 'zod';
import { Result } from "@carbonteq/fp"

interface UserConditionParams {
    name: string;
    userName: string;
    email: string
}

interface IFetchUserPaginationOptions {
    pageNumber: number
    pageSize: number
    conditionParams: UserConditionParams
}


export class FetchUserPaginationOptionsDto extends BaseDto {
    private static readonly schema = z.object({
        pageSize: z.coerce.number().gte(1, 'Page size must greater than 0.'),
        pageNumber: z.coerce.number().gte(1, 'Page number must greater than 0.'),
        name: z.string({
            invalid_type_error: "Name must be a string",
        }).optional().default(""),
        userName: z.string({
            invalid_type_error: "Username must be a string",
        }).optional().default(""),
        email: z.string({
            invalid_type_error: "Email must be a string",
        }).optional().default(""),
    });

    constructor(readonly pageSize: number, readonly pageNumber: number, readonly name?: string, readonly userName?: string, readonly email?: string) {
        super();
    }

    static create(data: unknown): DtoValidationResult<FetchUserPaginationOptionsDto> {
        const res = BaseDto.validate<{ pageNumber: number, pageSize: number, name?: string, email?: string, userName?: string}>(FetchUserPaginationOptionsDto.schema, data);
        return res.map(({ pageNumber, pageSize, name, email, userName}) => new FetchUserPaginationOptionsDto(pageSize, pageNumber, name, userName, email));
    }

    static toApp(
        { pageSize, pageNumber, name, userName, email }: FetchUserPaginationOptionsDto
        ): DtoValidationResult<IFetchUserPaginationOptions> {
        return Result.Ok({
            pageNumber,
            pageSize,
            conditionParams: {
                name: name || "",
                userName: userName || "",
                email: email || "",
            }
        })
    }
}


