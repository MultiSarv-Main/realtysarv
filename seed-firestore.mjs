import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function main() {
    const userCred = await signInAnonymously(auth);
    const uid = userCred.user.uid;
    console.log('Authenticated as', uid);

    await setDoc(doc(db, 'users', uid), {
        id: uid,
        companyId: 'company_001',
        email: 'admin@realtysarv.com',
        name: 'Rohan Kumar',
        role: 'Admin',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    await setDoc(doc(db, 'companies', 'company_001'), {
        companyId: 'company_001',
        name: 'RealtyServe Solutions Pvt Ltd',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    await setDoc(doc(db, 'projects', 'proj_001'), {
        projectId: 'proj_001',
        companyId: 'company_001',
        name: 'Sunset Heights Mumbai',
        projectStatus: 'Under Construction',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    await setDoc(doc(db, 'leads', 'lead_001'), {
        leadId: 'lead_001',
        companyId: 'company_001',
        ownerId: uid,
        leadStatus: 'Qualified',
        name: 'Rajesh Sharma',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    console.log('Firestore seed completed successfully.');
}

main().catch((error) => {
    console.error('Firestore seed failed:', error);
    process.exitCode = 1;
});
