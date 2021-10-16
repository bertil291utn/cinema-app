//Dependencies
import firebase from "firebase/app";
import "firebase/firestore";

const { 
  API_KEY_FIREBASE,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID
} = process.env;

//Previous configuration
const firebaseConfig = {
  apiKey: API_KEY_FIREBASE,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID
};

//Initialize Firebase
const fb = firebase.initializeApp(firebaseConfig);

//Database export
export const db = fb.firestore();