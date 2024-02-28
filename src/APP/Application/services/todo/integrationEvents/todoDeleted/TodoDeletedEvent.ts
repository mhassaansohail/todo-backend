import { IEvent } from "../../../../interfaces/IEvent";

interface ITodoId {
    todoId: string
}

export class TodoDeletedEvent implements IEvent<ITodoId> {
    private readonly todoId: ITodoId;
    constructor(todoId: ITodoId) {
        this.todoId = todoId;
    }

    getDetails(): ITodoId {
        return this.todoId;
    }
}