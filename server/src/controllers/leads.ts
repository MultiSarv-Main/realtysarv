import { Request, Response } from 'express';
import * as db from '../db';

export const getAllLeads = async (req: Request, res: Response) => {
    try {
        const leads = await db.getLeads();
        res.status(200).json(leads);
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ message: 'Error fetching leads' });
    }
};

export const getLeadById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const lead = await db.getLeadById(id);
        if (lead) {
            res.status(200).json(lead);
        } else {
            res.status(404).json({ message: 'Lead not found' });
        }
    } catch (error) {
        console.error(`Error fetching lead with id ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error fetching lead' });
    }
};

// Add create, update, delete functions here later
