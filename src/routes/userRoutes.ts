import express from 'express';
import { UserController } from '../controllers';
import { BaseRouter } from './baseRoutes';

class UserRouter extends BaseRouter {
    controller: UserController;
    router: express.Router;

    constructor() {
        super();
        this.router = express.Router();
        this.controller = new UserController();
        this.createRoutes();
    }

    createRoutes(): void {
        this.router.get('/', this.controller.getAll);
        this.router.get('/:id', this.controller.getById);
        this.router.get('/search/params', this.controller.getByParams);
        this.router.post('/', this.controller.create);
        this.router.put('/:id', this.controller.update);
        this.router.delete('/:id', this.controller.delete);
    }
}

export default new UserRouter().router;