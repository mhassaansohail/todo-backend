interface ITodo {
    todoId: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class TodoDTO {

    static toDomain(todo: ITodo) {
        const { todoId, ...todoObj } = todo;
        return { Id: todoId, ...todoObj }
    }
}