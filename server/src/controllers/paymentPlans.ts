import { Request, Response } from 'express';
import * as db from '../db';

export const getAllPaymentPlans = async (req: Request, res: Response) => {
    try {
        const paymentPlans = await db.getPaymentPlans();
        res.status(200).json(paymentPlans);
    } catch (error) {
        console.error('Error fetching payment plans:', error);
        res.status(500).json({ message: 'Error fetching payment plans' });
    }
};
