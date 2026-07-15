import { Router } from 'express';
import leadRoutes from './leads';
import userRoutes from './users';
import projectRoutes from './projects';
import sourceRoutes from './sources';
import paymentPlanRoutes from './paymentPlans';
import templateRoutes from './templates';
import dnsRoutes from './dns';


const router = Router();

router.use('/leads', leadRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/sources', sourceRoutes);
router.use('/payment-plans', paymentPlanRoutes);
router.use('/templates', templateRoutes);
router.use('/dns', dnsRoutes);


export default router;
