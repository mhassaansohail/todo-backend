import express from 'express';
import { TodoController } from '../controllers';

const todoRouter = express.Router();

todoRouter.get('/', TodoController.getTodos);
todoRouter.get('/:todoId', TodoController.getTodoById);
todoRouter.post('/', TodoController.createTodo);
todoRouter.put('/:todoId', TodoController.updateTodo);
todoRouter.delete('/:todoId', TodoController.deleteTodo);

export default todoRouter;
