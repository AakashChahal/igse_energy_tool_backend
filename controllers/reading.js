import Reading from "../models/reading.js";
import { createError } from "../utils/error.js";
import * as firebase from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "../app.js";

export const createReading = async (req, res, next) => {
    const reading = { ...req.body };

    try {
        const newReading = new Reading({ ...reading })["customer_id"];
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();
        let dbRef = ref(
            database,
            `readings/${newReading.customer_id
                .split("@")[0]
                .replace(/[.#$\\]/g, "_")}/`
        );
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const reading_id = snapshot.val().length;
            newReading.reading_id = reading_id;
        } else {
            newReading.reading_id = 1;
        }
        dbRef = ref(
            database,
            `readings/${newReading.customer_id
                .split("@")[0]
                .replace(/[.#$\\]/g, "_")}/${newReading.reading_id}`
        );
        await set(dbRef, { ...newReading });
        res.status(200).json({
            message: "Reading created",
            reading: { ...newReading },
        });
    } catch (err) {
        next(createError(err));
    }
};

export const deleteReading = async (req, res, next) => {
    const readingId = req.params.reading_id;
    const customerId = req.params.customer_id;
    try {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();
        const dbRef = ref(
            database,
            `readings/${customerId
                .split("@")[0]
                .replace(/[.#$\\]/g, "_")}/${readingId}`
        );
        await remove(dbRef);
        res.status(200).json({
            message: "Reading deleted",
        });
    } catch (err) {
        next(createError(err));
    }
};

export const getReading = async (req, res, next) => {
    const readingId = req.params.reading_id;
    try {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();
        const dbRef = ref(database, `readings/${readingId}`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            res.status(200).json({
                message: "Reading found",
                reading: snapshot.val(),
            });
        } else {
            res.status(404).json({
                message: "Reading not found",
            });
        }
    } catch (err) {
        next(createError(err));
    }
};

export const getReadings = async (req, res, next) => {
    try {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();
        const dbRef = ref(database, `readings`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            res.status(200).json({
                message: "Readings found",
                readings: snapshot.val(),
            });
        } else {
            res.status(404).json({
                message: "Readings not found",
            });
        }
    } catch (err) {
        next(createError(err));
    }
};
