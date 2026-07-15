import { Router } from 'express';
import * as LeadController from '../controllers/leads';

const router = Router();

router.get('/', LeadController.getAllLeads);
router.get('/:id', LeadController.getLeadById);
// Define POST, PUT, DELETE routes here later

export default router;
