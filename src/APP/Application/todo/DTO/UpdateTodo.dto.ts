import { IUpdateTodo } from "./IUpdateTodo.dto";

export class UpdateTodoDTO {
    private constructor() { };

    static toDomain(todo: IUpdateTodo) {
        const { todoId, ...todoObj } = todo;
        return { Id: todoId, ...todoObj }
    }
}