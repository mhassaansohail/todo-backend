interface UserConditionParams {
    name: string;
    userName: string;
    email: string;
}

interface IGetPaginatedUsers {
    pageNumber: number
    pageSize: number
    conditionParams: UserConditionParams
}

interface GetUsersParams {
    pageNumber: number;
    pageSize: number;
    name: string;
    userName: string;
    email: string;
}

export class GetPaginatedUsersDTO {
    constructor() { };

    static toApp({ pageNumber, pageSize, name, userName, email}: GetUsersParams): IGetPaginatedUsers {
    return {
        pageNumber,
        pageSize,
        conditionParams: {
            name,
            userName,
            email
        }
    }
}
}