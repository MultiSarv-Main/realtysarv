import { Router } from 'express';
import * as SourceController from '../controllers/sources';

const router = Router();

router.get('/', SourceController.getAllSources);

export default router;
