import { inject, injectable, singleton } from "tsyringe";
import { TodoService } from "./TodoService";
import { AddTodoCommand } from "../../Domain/commands/todo/AddTodoCommand";
import { Command } from "../../Domain/commands/Command";
import { DeleteTodoCommand } from "../../Domain/commands/todo/DeleteTodoCommand";
import { UpdateTodoCommand } from "../../Domain/commands/todo/UpdateTodoCommand";
import { Handler } from "../utils/Handler";

@singleton()
export class TodoCommandHandler extends Handler {
    private result: any;
    constructor(@inject("TodoService") private todoService: TodoService) {
        super();
        this.todoService = todoService;
    }

    handle(command: Command) {
        if (command instanceof AddTodoCommand) {
            return this.todoService.addTodo(command.getDetails());
        } else if (command instanceof UpdateTodoCommand) {
            this.result = this.todoService.updateTodo(command.getDetails().todoId, command.getDetails());
        } else if (command instanceof DeleteTodoCommand) {
            this.result = this.todoService.deleteTodo(command.getDetails().todoId);
        }
    }

    getResult() {
        return this.result;
    }
}