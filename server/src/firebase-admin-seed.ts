import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const projectId = process.env.FIREBASE_PROJECT_ID || 'gen-lang-client-0873542795';
const databaseId = process.env.FIRESTORE_DATABASE_ID || 'ai-studio-10a71e0e-6277-4ebb-b538-3263c6ea0ada';

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.warn('GOOGLE_APPLICATION_CREDENTIALS not set; trying application default credentials.');
}

const app = process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? initializeApp({
        credential: cert(path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS)),
        projectId,
    })
    : initializeApp({
        credential: applicationDefault(),
        projectId,
    });

const db = getFirestore(app, databaseId);
const database = databaseId;

async function seedCollection(name: string, docs: Array<Record<string, unknown>>) {
    const colRef = db.collection(name);
    for (const item of docs) {
        const id = String(item.id ?? `${name}-doc`);
        await colRef.doc(id).set(item);
    }
    console.log(`Seeded ${docs.length} docs into ${name}`);
}

async function main() {
    try {
        await seedCollection('companies', [
            {
                id: 'company_001',
                name: 'RealtyServe Solutions Pvt Ltd',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ]);

        await seedCollection('users', [
            {
                id: 'user_001',
                companyId: 'company_001',
                email: 'admin@realtysarv.com',
                name: 'Rohan Kumar',
                role: 'Admin',
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ]);

        await seedCollection('projects', [
            {
                id: 'proj_001',
                companyId: 'company_001',
                name: 'Sunset Heights Mumbai',
                projectStatus: 'Under Construction',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ]);

        await seedCollection('leads', [
            {
                id: 'lead_001',
                companyId: 'company_001',
                ownerId: 'user_001',
                leadStatus: 'Qualified',
                name: 'Rajesh Sharma',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ]);

        console.log(`Seeding completed for database ${database}`);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exitCode = 1;
    }
}

main();
