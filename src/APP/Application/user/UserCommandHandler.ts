import { inject, injectable, singleton } from "tsyringe";
import { UserService } from "./UserService";
import { Command } from "../../Domain/commands/Command";
import { CreateUserCommand } from "../../Domain/commands/user/CreateUserCommand";
import { DeleteUserCommand } from "../../Domain/commands/user/DeleteUserCommand";
import { UpdateUserCommand } from "../../Domain/commands/user/UpdateUserCommand";
import { Handler } from "../utils/Handler";

@singleton()
export class UserCommandHandler extends Handler {
    private result: any;
    constructor(@inject("UserService") private userService: UserService) {
        super();
        this.userService = userService;
    }

    handle(command: Command) {
        if (command instanceof CreateUserCommand) {
            return this.userService.createUser(command.getDetails());
        } else if (command instanceof UpdateUserCommand) {
            this.result = this.userService.updateUser(command.getDetails().userId, command.getDetails());
        } else if (command instanceof DeleteUserCommand) {
            this.result = this.userService.deleteUser(command.getDetails().userId);
        }
    }

    getResult() {
        return this.result;
    }
}