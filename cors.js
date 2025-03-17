var admin = require("firebase-admin");

// Initialize Firebase Admin SDK with your service account key
var serviceAccount = require("./plai-c72e4-firebase-adminsdk-xffo1-054dd32a73.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get a reference to the Cloud Storage service using the default project ID
var storage = admin.storage();

// Define your bucket name
var bucketName = 'plai-c72e4.firebasestorage.app'; // Use the correct bucket name

// Define your CORS configuration
var corsConfiguration = [
  {
    origin: ['*'],
    method: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    responseHeader: ["Content-Type", "Authorization"], // Allow all necessary methods
    maxAgeSeconds: 3600,
  },
];

// Set the CORS configuration for the bucket
async function setCorsConfiguration() {
  try {
    await storage.bucket(bucketName).setCorsConfiguration(corsConfiguration);
    console.log(`CORS configuration set for bucket ${bucketName}`);
  } catch (error) {
    console.error('Error setting CORS configuration:', error);
  }
}

// Call the function to set CORS configuration
setCorsConfiguration();

