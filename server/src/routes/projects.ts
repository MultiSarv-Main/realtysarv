import { Router } from 'express';
import * as ProjectController from '../controllers/projects';

const router = Router();

router.get('/', ProjectController.getAllProjects);
router.get('/:id', ProjectController.getProjectById);

export default router;
