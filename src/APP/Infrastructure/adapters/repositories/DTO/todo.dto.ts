import Todo from "../../../../Domain/entities/Todo";

interface ITodo {
    todoId: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class TodoDTO {

    static toPersistance(todo: Todo) {
        const { Id, title, description, completed, createdAt, updatedAt } = todo.serialize();
        return {
            todoId: Id,
            title,
            description,
            completed,
            createdAt,
            updatedAt
        };
    }

    static toDomain(todo: ITodo) {
        const { todoId, ...todoObj } = todo;
        return { Id: todoId, ...todoObj }
    }
}