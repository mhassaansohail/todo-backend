import express from 'express';
import { todoController } from '../../APP/Infrastructure/IoC/container';

const todoRouter = express.Router();

todoRouter.get('/', todoController.getTodos);
todoRouter.get('/:todoId', todoController.getTodoById);
todoRouter.post('/', todoController.addTodo);
todoRouter.put('/:todoId', todoController.updateTodo);
todoRouter.delete('/:todoId', todoController.deleteTodo);

export default todoRouter;
