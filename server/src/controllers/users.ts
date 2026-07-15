import { Request, Response } from 'express';
import * as db from '../db';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await db.getUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await db.getUserById(id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(`Error fetching user with id ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error fetching user' });
    }
};
