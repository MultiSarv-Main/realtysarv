import { Router } from 'express';
import * as PaymentPlanController from '../controllers/paymentPlans';

const router = Router();

router.get('/', PaymentPlanController.getAllPaymentPlans);

export default router;
