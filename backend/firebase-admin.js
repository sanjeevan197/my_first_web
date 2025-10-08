const admin = require('firebase-admin');

// Initialize Firebase Admin (you'll need to add your service account key)
const serviceAccount = {
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
};

// For demo purposes, we'll skip Firebase Admin initialization
// In production, uncomment and add your service account:
/*
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
*/

// Mock verification for demo
const verifyFirebaseToken = async (token) => {
  try {
    // In production, use: admin.auth().verifyIdToken(token)
    // For demo, decode JWT manually
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return {
      uid: payload.user_id || payload.sub,
      email: payload.email,
      name: payload.name,
      email_verified: payload.email_verified
    };
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = { verifyFirebaseToken };