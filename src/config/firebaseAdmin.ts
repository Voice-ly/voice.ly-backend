import admin from "firebase-admin";

/**
 * Initializes the Firebase Admin SDK if it has not been initialized yet.
 *
 * This block ensures that the Firebase Admin app is created only once.
 * It uses environment variables to load the Firebase service account
 * credentials securely.
 *
 * The private key is formatted to replace escaped newline characters
 * with actual newline characters to meet Firebase's expected format.
 */

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    } as any),
  });
}

/**
 * Firebase Admin Auth instance.
 *
 * Use `adminAuth` to manage users, verify tokens, and perform auth-related
 * administrative actions.
 */
export const adminAuth = admin.auth();

/**
 * Firestore database instance.
 *
 * Use `adminDb` to read and write data to Firestore from server-side code.
 */
export const adminDb = admin.firestore();
