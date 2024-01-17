import express from 'express';
import { userController } from '../controllers';

const userRouter = express.Router();

userRouter.get('/', userController.getUsers);
userRouter.get('/:userId', userController.getUserById);
userRouter.post('/', userController.createUser);
userRouter.put('/:userId', userController.updateUser);
userRouter.delete('/:userId', userController.deleteUser);

export default userRouter;