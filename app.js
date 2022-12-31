import express from "express";
import * as firebase from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import cors from "cors";
import dotenv from "dotenv";

import authRoute from "./routes/auth.js";
import readingRoute from "./routes/reading.js";
import tariffRoute from "./routes/tariff.js";
import evcRoute from "./routes/voucher.js";
import userRoute from "./routes/users.js";

dotenv.config();
const app = express();

export const firebaseConfig = {
    apiKey: "AIzaSyAF57fDJpxBjL2OS4R1x7vHNxGOaugdOeY",
    authDomain: "igse-energy-tool.firebaseapp.com",
    databaseURL: "https://igse-energy-tool-default-rtdb.firebaseio.com",
    projectId: "igse-energy-tool",
    storageBucket: "igse-energy-tool.appspot.com",
    messagingSenderId: "994278000336",
    appId: "1:994278000336:web:7099deec2acecbd2ee80d5",
    measurementId: "G-YGQ5LCHR41",
};

export const connect = async () => {
    try {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();
    } catch (err) {
        console.log(err);
    }
};

// middleware
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/evc", evcRoute);
app.use("/api/bill", readingRoute);
app.use("/api/tariff", tariffRoute);

app.use("/igse/propertycount", (req, res) => {
    res.send({
        propertyCount: 100,
        message: "Not yet implemented",
    });
});

app.use((err, req, res, next) => {
    const errorStatus = err.statusCode || 500;
    const errorMessage = err.message || "Something went wrong";
    return res
        .status(errorStatus)
        .json({ success: false, message: errorMessage, status: errorStatus });
});

app.listen(8080, () => {
    connect();
});
