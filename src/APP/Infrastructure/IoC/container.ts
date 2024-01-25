import "reflect-metadata";
import { container } from "tsyringe";
import { Logger } from "../logger/Logger";
import { CommandBus } from "../../Application/utils/CommandBus";
import { OAuthService } from "../services/OAuthService";
import { JWTService } from "../services/JWTService";
import { AuthService } from "../../Application/auth/AuthService";
import { AuthMiddleware } from "../../../HTTP/middlewares/AuthMiddleware";
import { AuthController } from "../../../HTTP/controllers/AuthController";
import { TodoController } from "../../../HTTP/controllers/TodoController";
import { UserController } from "../../../HTTP/controllers/UserController";
import { UserService } from "../../Application/user/UserService";
import { TodoService } from "../../Application/todo/TodoService";
import { TodoCommandHandler } from "../../Application/todo/TodoCommandHandler";
import { UserCommandHandler } from "../../Application/user/UserCommandHandler";
import { MySQLUserRepository } from "../repositories/MySql/UserRepository";
import { MySQLTodoRepository } from "../repositories/MySql/TodoRepository";

container.register("UserCommandHandler", UserCommandHandler);
container.register("TodoCommandHandler", TodoCommandHandler);
container.register("CommandBus", CommandBus);
container.register("Logger", { useClass: Logger });
container.register("AuthService", { useClass: AuthService });
container.register("OAuthService", { useClass: OAuthService });
container.register("JWTService", { useClass: JWTService });
container.register("UserRepository", { useClass: MySQLUserRepository });
container.register("TodoRepository", { useClass: MySQLTodoRepository });
container.register("TodoService", { useClass: TodoService });

const oAuthService = container.resolve(OAuthService);
const authService = container.resolve(AuthService);
const authMiddleware = container.resolve(AuthMiddleware);
const authController = container.resolve(AuthController);
const userRepository = container.resolve(MySQLUserRepository);
const todoRepository = container.resolve(MySQLTodoRepository);
const userService = container.resolve(UserService);
const todoService = container.resolve(TodoService);
const todoCommandHandler = container.resolve(TodoCommandHandler);
const userCommandHandler = container.resolve(UserCommandHandler);
const commandBus = container.resolve(CommandBus);
const todoController = container.resolve(TodoController);
const userController = container.resolve(UserController);

export {
    container,
    commandBus,
    userCommandHandler,
    todoCommandHandler,
    authMiddleware,
    authController,
    authService,
    oAuthService,
    userController,
    userService,
    userRepository,
    todoController,
    todoService,
    todoRepository
};