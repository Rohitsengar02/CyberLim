
import admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';

let app: App | undefined;

function initializeFirebaseAdmin() {
    if (admin.apps.length > 0) {
        app = admin.app();
        return;
    }

    if (process.env.FIREBASE_ADMIN_SDK_CONFIG) {
        try {
            // This is the key fix: It replaces the literal '\\n' string with a proper newline character '\n'
            // which is required for the JSON parser to correctly handle the private key.
            const serviceAccountJson = process.env.FIREBASE_ADMIN_SDK_CONFIG.replace(/\\n/g, '\n');
            const serviceAccount = JSON.parse(serviceAccountJson);

            app = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            });
        } catch (error: any) {
            console.error('Failed to parse or initialize Firebase Admin SDK. The FIREBASE_ADMIN_SDK_CONFIG in your .env file is likely malformed JSON. Please check it carefully.', error.message);
        }
    } else {
        console.warn('FIREBASE_ADMIN_SDK_CONFIG is not set. Firebase Admin features will be unavailable.');
    }
}

initializeFirebaseAdmin();

function getDb(): admin.firestore.Firestore {
    if (!app) {
        throw new Error("Firebase Admin SDK is not initialized. Check your environment variables and ensure FIREBASE_ADMIN_SDK_CONFIG is set correctly.");
    }
    return admin.firestore();
}

function getAuth(): admin.auth.Auth {
    if (!app) {
        throw new Error("Firebase Admin SDK is not initialized. Check your environment variables and ensure FIREBASE_ADMIN_SDK_CONFIG is set correctly.");
    }
    return admin.auth();
}

function getStorage(): admin.storage.Storage {
     if (!app) {
        throw new Error("Firebase Admin SDK is not initialized. Check your environment variables and ensure FIREBASE_ADMIN_SDK_CONFIG is set correctly.");
    }
    return admin.storage();
}

export { getDb, getAuth, getStorage };
