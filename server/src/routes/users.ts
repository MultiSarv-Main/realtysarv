import { Router } from 'express';
import * as UserController from '../controllers/users';

const router = Router();

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);

export default router;
