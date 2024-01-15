import { UserStore, TodoStore } from "../stores";
// import { generateAuthURL, getTokenFromCode, authenticateToken } from "./OAuthService";
import { OAuthService } from "./OAuthService";
import { AuthService } from "./AuthService";
import { UserService } from "./UserService";
import { TodoService } from "./TodoService";

const userService = new UserService(new UserStore());
const todoService = new TodoService(new TodoStore());
const oAuthService = new OAuthService();

export { AuthService, oAuthService, userService, todoService };