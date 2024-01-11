import express from 'express';
import { TodoController } from '../controllers';
import { BaseRouter } from './baseRoutes';

class TodoRouter extends BaseRouter {
    controller: TodoController;
    router: express.Router;

    constructor() {
        super();
        this.router = express.Router();
        this.controller = new TodoController();
        this.createRoutes();
    }

    createRoutes(): void {
        this.router.get('/', this.controller.getAll);
        this.router.get('/:id', this.controller.getById);
        this.router.get('/search/params', this.controller.getByParams);
        this.router.post('/', this.controller.add);
        this.router.put('/:id', this.controller.update);
        this.router.delete('/:id', this.controller.delete);
    }
}

export default new TodoRouter().router