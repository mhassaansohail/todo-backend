import { TodoAttributes } from "../types/todo";

class Todo implements TodoAttributes {
    todoId: string;
    title: string;
    description: string;
    completed: boolean;

    constructor(todoId: string = "NULL", title: string = "NULL", description: string = "NULL", completed: boolean = false) {
        this.todoId = todoId;
        this.title = title;
        this.description = description;
        this.completed = completed;
    }

    static createByParams(todoId: string, title: string, description: string, completed: boolean): Todo {
        return new Todo(todoId, title, description, completed);
    }

    static createByObject({ todoId, title, description, completed }: TodoAttributes): Todo {
        return new Todo(todoId, title, description, completed);
    }
}

export default Todo;