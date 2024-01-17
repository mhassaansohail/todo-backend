import { AuthMiddleware } from "./AuthMiddleware";
import { oAuthService } from "../services";
import { authService } from "../services";

export const authMiddleware = new AuthMiddleware(authService, oAuthService).authenticateUser;