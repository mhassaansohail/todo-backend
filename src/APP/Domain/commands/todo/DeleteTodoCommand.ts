import { Command } from "../Command";

export class DeleteTodoCommand implements Command {
    private todoId: string;

    constructor(todoId: string) {
        this.todoId = todoId;
    }

    getDetails(): Record<string, string> {
        return { todoId: this.todoId }
    }
}