import { query } from './db/connection';
import { Lead, User, Project, Source, PaymentPlan, Template } from './types';

// Helper to handle JSON parsing from DB
function parseJsonFields<T>(item: any): T {
    const jsonFields: (keyof T)[] = [
        'messages', 'initialInterest', 'siteVisits', 'tasks', 'propertyImages', 'bookingDetails', // Lead fields
        'assignedProjectIds', // User fields
        'wings', 'inventory', 'parkingInventory', 'paymentPlanIds', // Project fields
        'milestones' // PaymentPlan fields
    ] as (keyof T)[];

    const newItem = { ...item };
    for (const field of jsonFields) {
        if (newItem[field]) {
            if (typeof newItem[field] === 'string') {
                try {
                    newItem[field] = JSON.parse(newItem[field]);
                } catch (e) {
                    console.error(`Error parsing JSON for field ${String(field)}:`, e);
                    newItem[field] = null; 
                }
            } else if (typeof newItem[field] === 'object') {
                // If the DB driver already parsed it (some pg drivers parse JSON/JSONB automatically)
                // we keep it as is.
            }
        }
    }
    return newItem as T;
}

// --- LEADS ---
export const getLeads = async (): Promise<Lead[]> => {
    const rows = await query('SELECT * FROM leads');
    return (rows as any[]).map(row => parseJsonFields<Lead>(row));
};

export const getLeadById = async (id: string): Promise<Lead | undefined> => {
    const rows = await query('SELECT * FROM leads WHERE id = ?', [id]);
    const leads = rows as any[];
    if (leads.length === 0) return undefined;
    return parseJsonFields<Lead>(leads[0]);
};


// --- USERS ---
export const getUsers = async (): Promise<User[]> => {
    const rows = await query('SELECT * FROM users');
    return (rows as any[]).map(row => parseJsonFields<User>(row));
};

export const getUserById = async (id: string): Promise<User | undefined> => {
    const rows = await query('SELECT * FROM users WHERE id = ?', [id]);
    const users = rows as any[];
    if (users.length === 0) return undefined;
    return parseJsonFields<User>(users[0]);
};

// --- PROJECTS ---
export const getProjects = async (): Promise<Project[]> => {
    const rows = await query('SELECT * FROM projects');
     return (rows as any[]).map(row => parseJsonFields<Project>(row));
};

export const getProjectById = async (id: string): Promise<Project | undefined> => {
    const rows = await query('SELECT * FROM projects WHERE id = ?', [id]);
    const projects = rows as any[];
    if (projects.length === 0) return undefined;
    return parseJsonFields<Project>(projects[0]);
};

// --- SOURCES ---
export const getSources = async (): Promise<Source[]> => {
    const rows = await query('SELECT * FROM sources');
    return rows as Source[];
};

// --- PAYMENT PLANS ---
export const getPaymentPlans = async (): Promise<PaymentPlan[]> => {
    const rows = await query('SELECT * FROM payment_plans');
    return (rows as any[]).map(row => parseJsonFields<PaymentPlan>(row));
};

// --- TEMPLATES ---
export const getTemplates = async (): Promise<Template[]> => {
    const rows = await query('SELECT * FROM templates');
    return rows as Template[];
};
