import express from 'express';
import { TodoController } from '../controllers';

const todoRouter = express.Router();

todoRouter.get('/', TodoController.getAllTodos);
todoRouter.get('/:todoId', TodoController.getTodoById);
todoRouter.get('/search/params', TodoController.searchTodo);
todoRouter.post('/', TodoController.createTodo);
todoRouter.put('/:todoId', TodoController.updateTodo);
todoRouter.delete('/:todoId', TodoController.deleteTodo);

export default todoRouter;
