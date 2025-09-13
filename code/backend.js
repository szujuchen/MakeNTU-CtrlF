import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import mqtt from "precompiled-mqtt";

const firebaseConfig = {
    apiKey: "AIzaSyBASJwskSzstukIaAPkm-KwGYICodNlntM",
    authDomain: "makentu-e252b.firebaseapp.com",
    databaseURL: "https://makentu-e252b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "makentu-e252b",
    storageBucket: "makentu-e252b.appspot.com",
    messagingSenderId: "482446525607",
    appId: "1:482446525607:web:2d3bd187d0c4d441640782"
};

const app = initializeApp(firebaseConfig, '2024MakeNTU');

export default app;
export const fireDB = getFirestore(app);
export const appStorage = getStorage(app);
export const server = "10.10.2.98:8700";