import { TodoAttributes } from "APP/Domain/types/todo";
import { Command } from "../Command";

export class UpdateTodoCommand implements Command {
    private todoId: string;
    private title: string;
    private description: string;
    private completed: boolean;

    constructor({ todoId, title, description, completed }: TodoAttributes) {
        this.todoId = todoId;
        this.title = title;
        this.description = description;
        this.completed = completed;
    }

    getDetails(): TodoAttributes {
        return {
            todoId: this.todoId,
            title: this.title,
            description: this.description,
            completed: this.completed
        };
    }
}