import express from 'express';
import { UserController } from '../controllers';

const userRouter = express.Router();

userRouter.get('/', UserController.getAllUsers);
userRouter.get('/:userId', UserController.getUserById);
userRouter.get('/search/params', UserController.searchUser);
userRouter.post('/', UserController.createUser);
userRouter.put('/:userId', UserController.updateUser);
userRouter.delete('/:userId', UserController.deleteUser);

export default userRouter;