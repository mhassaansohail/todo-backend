interface TodoConditionParams {
    title: string;
    description: string;
}

interface IGetPaginatedTodos {
    pageNumber: number
    pageSize: number
    conditionParams: TodoConditionParams
}

interface GetTodosParams {
    pageNumber: number;
    pageSize: number;
    title: string;
    description: string;
}

export class GetPaginatedTodosDTO {
    constructor() { };

    static toApp({ pageNumber, pageSize, title, description}: GetTodosParams): IGetPaginatedTodos {
    return {
        pageNumber,
        pageSize,
        conditionParams: {
            title,
            description
        }
    }
}
}