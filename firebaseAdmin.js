require('dotenv').config();
const admin = require("firebase-admin");

const serviceAccount = require(process.env.FIREBASE_ADMIN_CREDENTIALS);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };
