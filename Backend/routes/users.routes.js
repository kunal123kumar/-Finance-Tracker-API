import express from 'express';
import { authMiddleware, authorize } from '../middleware/auth.js';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/users.controller.js';

const userRouter = express.Router();
userRouter.use(authMiddleware, authorize("admin"));

userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;
