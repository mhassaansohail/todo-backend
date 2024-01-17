import { AuthService } from "./AuthService";
import { userStore, todoStore } from "../stores";
import { OAuthService } from "./OAuthService";
import { UserService } from "./UserService";
import { TodoService } from "./TodoService";

const userService = new UserService(userStore);
const todoService = new TodoService(todoStore);
const oAuthService = new OAuthService();
const authService = new AuthService(userStore, oAuthService);

export { authService, oAuthService, userService, todoService };