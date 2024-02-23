import "reflect-metadata";
import { container } from "tsyringe";
import { Logger } from "../logger/Logger";
import { OAuthService } from "../adapters/services/OAuth.service";
import { JWTService } from "../adapters/services/JWT.service";
import { AuthService } from "../../Application/auth/Auth.service";
import { AuthMiddleware } from "../../../HTTP/middlewares/Auth.middleware";
import { AuthController } from "../../../HTTP/controllers/Auth.controller";
import { TodoController } from "../../../HTTP/controllers/Todo.controller";
import { UserController } from "../../../HTTP/controllers/User.controller";
import { UserService } from "../../Application/user/User.service";
import { TodoService } from "../../Application/todo/Todo.service";
import { PrismaUserRepository } from "../adapters/repositories/PrismaRepositories/User.repository";
import { PrismaTodoRepository } from "../adapters/repositories/PrismaRepositories/Todo.repository";
import { BCryptEncryptionService } from "../adapters/services/BCryptEncryption.service";
import { UUIDGenerator } from "../adapters/services/UUIDGenerator.service";
import { PrismaClient } from "@prisma/client";
import { ErrorInterceptor } from "../../..//HTTP/middlewares/ErrorInterceptor.middleware";
import { EventManager } from "../events/EventManager";

container.register("Logger", { useClass: Logger });
container.register<PrismaClient>('PrismaClient', { useValue: new PrismaClient() });
container.register("AuthService", { useClass: AuthService });
container.register("EncryptionService", { useClass: BCryptEncryptionService });
container.register("OAuthService", { useClass: OAuthService });
container.register("JWTService", { useClass: JWTService });
container.register("UserRepository", { useClass: PrismaUserRepository });
container.register("TodoRepository", { useClass: PrismaTodoRepository });
container.register("UniqueIDGenerator", { useClass: UUIDGenerator });
container.register("UserService", { useClass: UserService });
container.register("TodoService", { useClass: TodoService });
container.register("EventEmitter", {useClass: EventManager});

const authMiddleware = container.resolve(AuthMiddleware);
const errorInterceptor = container.resolve(ErrorInterceptor);
const oAuthService = container.resolve(OAuthService);
const authService = container.resolve(AuthService);
const authController = container.resolve(AuthController);
const userRepository = container.resolve(PrismaUserRepository);
const todoRepository = container.resolve(PrismaTodoRepository);
const userService = container.resolve(UserService);
const todoService = container.resolve(TodoService);
const todoController = container.resolve(TodoController);
const userController = container.resolve(UserController);

export {
    container,
    authMiddleware,
    errorInterceptor,
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