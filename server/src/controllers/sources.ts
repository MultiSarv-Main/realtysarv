import { Request, Response } from 'express';
import * as db from '../db';

export const getAllSources = async (req: Request, res: Response) => {
    try {
        const sources = await db.getSources();
        res.status(200).json(sources);
    } catch (error) {
        console.error('Error fetching sources:', error);
        res.status(500).json({ message: 'Error fetching sources' });
    }
};
