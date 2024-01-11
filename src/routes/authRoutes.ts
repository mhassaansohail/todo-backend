import express from 'express';
import { AuthController } from '../controllers';
import { BaseRouter } from './baseRoutes';

class AuthRouter extends BaseRouter {
    controller: AuthController;
    router: express.Router;

    constructor() {
        super();
        this.router = express.Router();
        this.controller = new AuthController();
        this.createRoutes();
    }

    createRoutes(): void {
        this.router.post('/login', this.controller.login);
    }
}

export default new AuthRouter().router;