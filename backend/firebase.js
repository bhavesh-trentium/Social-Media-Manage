const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://social-media-manage-3a16d-default-rtdb.firebaseio.com/",
  storageBucket: "gs://social-media-manage-3a16d.appspot.com",
});
const database = admin.database();
const storage = admin.storage().bucket();
module.exports = { database, storage };
