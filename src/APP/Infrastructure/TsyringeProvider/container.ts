import "reflect-metadata";
import { container } from "tsyringe";
import { Logger } from "../logger/Logger";
import { OAuthService } from "../services/OAuthService";
import { JWTService } from "../services/JWTService";
import { AuthService } from "../../Application/auth/AuthService";
import { AuthMiddleware } from "../../../HTTP/middlewares/AuthMiddleware";
import { AuthController } from "../../../HTTP/controllers/AuthController";
import { TodoController } from "../../../HTTP/controllers/TodoController";
import { UserController } from "../../../HTTP/controllers/UserController";
import { UserService } from "../../Application/user/UserService";
import { TodoService } from "../../Application/todo/TodoService";
import { MySQLUserRepository } from "../repositories/MySqlRepositories/UserRepository";
import { MySQLTodoRepository } from "../repositories/MySqlRepositories/TodoRepository";
import { BCryptEncryptionService } from "../services/BCryptEncryptionService";

container.register("Logger", { useClass: Logger });
container.register("AuthService", { useClass: AuthService });
container.register("EncryptionService", { useClass: BCryptEncryptionService });
container.register("OAuthService", { useClass: OAuthService });
container.register("JWTService", { useClass: JWTService });
container.register("UserRepository", { useClass: MySQLUserRepository });
container.register("TodoRepository", { useClass: MySQLTodoRepository });
container.register("UserService", { useClass: UserService });
container.register("TodoService", { useClass: TodoService });

const oAuthService = container.resolve(OAuthService);
const authService = container.resolve(AuthService);
const authMiddleware = container.resolve(AuthMiddleware);
const authController = container.resolve(AuthController);
const userRepository = container.resolve(MySQLUserRepository);
const todoRepository = container.resolve(MySQLTodoRepository);
const userService = container.resolve(UserService);
const todoService = container.resolve(TodoService);
const todoController = container.resolve(TodoController);
const userController = container.resolve(UserController);

export {
    container,
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