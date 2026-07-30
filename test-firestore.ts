import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
const firebaseConfig = { projectId: "test" };
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, { experimentalForceLongPolling: true });
console.log("OK");
