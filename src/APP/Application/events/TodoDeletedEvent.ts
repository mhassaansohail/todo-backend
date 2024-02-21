import { Event } from "./Event";

interface ITodoId {
    todoId: string
}

export class TodoDeletedEvent implements Event<ITodoId> {
    private readonly todoId: ITodoId;
    constructor(todoId: ITodoId) {
        this.todoId = todoId;
    }

    getDetails(): ITodoId {
        return this.todoId;
    }
}