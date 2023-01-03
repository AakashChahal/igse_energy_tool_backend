import express from "express";
import * as firebase from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
// import cors from "cors";
import dotenv from "dotenv";

import adminRoutes from "./routes/admin.js";
import authRoute from "./routes/auth.js";
import readingRoute from "./routes/reading.js";
import tariffRoute from "./routes/tariff.js";
import evcRoute from "./routes/voucher.js";
import userRoute from "./routes/users.js";
import igseRoute from "./routes/igse.js";
import cookieParser from "cookie-parser";

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

// middleware
app.use(cookieParser());
app.use(express.json());
// app.use(cors());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to IGSE Energy Tool",
        availableAPIs: [
            {
                name: "auth",
                description:
                    "Authentication API to authenticate users making requests and signing/registering",
            },
            { name: "users", description: "User API" },
            { name: "evc", description: "EVC API" },
            { name: "reading", description: "Readings (Meter Reading) API" },
            { name: "tariff", description: "Tariff API" },
            { name: "igse", description: "IGSE API only accessible by admin" },
        ],
    });
});

// api routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/evc", evcRoute);
app.use("/api/reading", readingRoute);
app.use("/api/tariff", tariffRoute);

// admin routes
app.use("/admin", adminRoutes);

// admin api routes
app.use("/igse", igseRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.statusCode || 500;
    const errorMessage = err.message || "Something went wrong";
    return res
        .status(errorStatus)
        .json({ success: false, message: errorMessage, status: errorStatus });
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
