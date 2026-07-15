import { Router } from 'express';
import * as TemplateController from '../controllers/templates';

const router = Router();

router.get('/', TemplateController.getAllTemplates);

export default router;
