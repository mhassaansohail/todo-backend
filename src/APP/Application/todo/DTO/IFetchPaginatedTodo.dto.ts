import Todo from "APP/Domain/entities/Todo";

export interface IFetchPaginatedTodo {
    pageSize: number;
    pageNumber: number;
    conditionParams: Partial<Todo>
}