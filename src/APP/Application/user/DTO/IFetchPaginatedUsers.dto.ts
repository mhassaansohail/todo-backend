import User from "APP/Domain/entities/User";

export interface IFetchPaginatedUsers {
    pageSize: number;
    pageNumber: number;
    conditionParams: Partial<User>
}