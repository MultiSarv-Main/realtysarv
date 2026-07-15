import { Request, Response } from 'express';
import * as db from '../db';

export const getAllTemplates = async (req: Request, res: Response) => {
    try {
        const templates = await db.getTemplates();
        res.status(200).json(templates);
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ message: 'Error fetching templates' });
    }
};
