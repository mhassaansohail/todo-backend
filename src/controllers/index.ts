import logger from "../logger";
import { UserController } from "./UserController";
import { TodoController } from "./TodoController";
import { AuthController } from "./AuthController";

const todoController = new TodoController(logger);
const userController = new UserController(logger);
const authController = new AuthController(logger);


export { authController, userController, todoController };