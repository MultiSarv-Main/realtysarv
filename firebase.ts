import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const fdb = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth();

const useEmulators = typeof window !== 'undefined'
    && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true';

// Only connect to local emulators when explicitly enabled.
if (useEmulators) {
    try {
        if (!auth.emulatorConfig) {
            connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        }
    } catch (error) {
        // Emulator already connected or not running
    }

    try {
        const settings = fdb._firestore;
        if (!settings.host?.includes('localhost')) {
            connectFirestoreEmulator(fdb, 'localhost', 8080);
        }
    } catch (error) {
        // Emulator already connected or not running
    }
}
