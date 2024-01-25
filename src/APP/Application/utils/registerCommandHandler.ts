import { commandBus, todoCommandHandler, userCommandHandler } from "APP/Infrastructure/IoC/container";
import { AddTodoCommand } from "APP/Domain/commands/todo/AddTodoCommand";
import { CreateUserCommand } from "APP/Domain/commands/user/CreateUserCommand";
import { UpdateUserCommand } from "APP/Domain/commands/user/UpdateUserCommand";
import { DeleteUserCommand } from "APP/Domain/commands/user/DeleteUserCommand";

// commandBus.registerHandler(GetUsersByParamsCommand.name, userCommandHandler);
commandBus.registerHandler(CreateUserCommand.name, userCommandHandler);
commandBus.registerHandler(UpdateUserCommand.name, userCommandHandler);
commandBus.registerHandler(DeleteUserCommand.name, userCommandHandler);
// commandBus.registerHandler(GetUserByIdUserCommand.name, userCommandHandler);
commandBus.registerHandler(AddTodoCommand.name, todoCommandHandler);
commandBus.registerHandler(UpdateUserCommand.name, todoCommandHandler);
commandBus.registerHandler(DeleteUserCommand.name, todoCommandHandler);
// commandBus.registerHandler(MarkTodoAsCompletedCommand.name, todoCommandHandler);
// commandBus.registerHandler(GetTodoByIdCommand.name, todoCommandHandler);
// commandBus.registerHandler(GetTodosByParamsCommand.name, todoCommandHandler);
// commandBus.registerHandler(AddTodoCommand.name, todoCommandHandler);
