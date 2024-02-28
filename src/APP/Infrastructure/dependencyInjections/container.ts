import "reflect-metadata";
import { container } from "tsyringe";
import { Logger } from "../logger/Logger";
import { OAuthService } from "../adapters/services/OAuthService";
import { JWTService } from "../adapters/services/JWTService";
import { AuthService } from "../../Application/services/auth/AuthService";
import { AuthMiddleware } from "../../../HTTP/middlewares/Auth.middleware";
import { AuthController } from "../../../HTTP/controllers/Auth.controller";
import { TodoController } from "../../../HTTP/controllers/Todo.controller";
import { UserController } from "../../../HTTP/controllers/User.controller";
import { UserService } from "../../Application/services/user/User.service";
import { PrismaUserRepository } from "../adapters/repositories/PrismaRepositories/UserRepository";
import { PrismaTodoRepository } from "../adapters/repositories/PrismaRepositories/TodoRepository";
import { BCryptEncryptionService } from "../adapters/services/BCryptEncryptionService";
import { UUIDGenerator } from "../adapters/services/UUIDGeneratorService";
import { PrismaClient } from "@prisma/client";
import { ErrorInterceptor } from "../../..//HTTP/middlewares/ErrorInterceptor.middleware";
import { EventManager } from "../adapters/services/EventManagerService";
import { NotificationService } from "../../Application/services/notifications/NotificationService";
import { EmailSender } from "../adapters/services/EmailSenderService";
import { TodoService } from "../../Application/services/todo/TodoService";
import { TodoDeletedEventListener } from "../../Application/services/todo/integrationEvents/todoDeleted/TodoDeletedEventListener";

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
container.register("NotificationService", { useClass: NotificationService });
container.registerSingleton("EventManager", EventManager);
container.register("NotificationSender", {useClass: EmailSender});

const authMiddleware = container.resolve(AuthMiddleware);
const errorInterceptor = container.resolve(ErrorInterceptor);
const oAuthService = container.resolve(OAuthService);
const authService = container.resolve(AuthService);
const authController = container.resolve(AuthController);
const userRepository = container.resolve(PrismaUserRepository);
const todoRepository = container.resolve(PrismaTodoRepository);
const userService = container.resolve(UserService);
const todoService = container.resolve(TodoService);
const todoDeletedEventListener = container.resolve(TodoDeletedEventListener);
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
    todoDeletedEventListener,
    todoRepository
};