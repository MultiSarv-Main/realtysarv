import { Request, Response } from 'express';
import * as db from '../db';

export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await db.getProjects();
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Error fetching projects' });
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const project = await db.getProjectById(id);
        if (project) {
            res.status(200).json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        console.error(`Error fetching project with id ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error fetching project' });
    }
};
