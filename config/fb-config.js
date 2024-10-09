import "firebase/firestore"

import { getFirestore, initializeFirestore, setLogLevel } from "firebase/firestore";

import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBpvV7dEVc1G36Al-PgzncL_-z7VVW4W7k",
  authDomain: "crescendo-154fb.firebaseapp.com",
  databaseURL: "https://crescendo-154fb-default-rtdb.firebaseio.com",
  projectId: "crescendo-154fb",
  storageBucket: "crescendo-154fb.appspot.com",
  messagingSenderId: "117521578099",
  appId: "1:117521578099:web:a8da28357fb5804b009206",
  measurementId: "G-KJYLWX7DXG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});