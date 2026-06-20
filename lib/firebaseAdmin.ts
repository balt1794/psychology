import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
//import serviceAccount from "@/plai-c72e4-firebase-adminsdk-xffo1-054dd32a73.json";

const firebaseAdminApp =
  getApps()[0] ||
  initializeApp({
    //credential: cert(serviceAccount as any),
    storageBucket: "plai-c72e4.firebasestorage.app",
  });
export const adminStorage = getStorage(firebaseAdminApp);