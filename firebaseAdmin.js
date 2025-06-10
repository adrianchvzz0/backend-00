require('dotenv').config();
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: serviceAccount.project_id + '.appspot.com',
    databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };
