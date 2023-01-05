import Tariff from "../models/Tariff.js";
import * as firebase from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "../app.js";

export const createTariff = async (req, res, next) => {
    const tariffs = req.body;
    let flag = false;
    for (const [tariff_type, rate] of Object.entries(tariffs)) {
        if (rate != "") {
            const newTariff = new Tariff(tariff_type, rate);
            try {
                const firebaseApp = firebase.initializeApp(firebaseConfig);
                const database = getDatabase(firebaseApp);
                const auth = getAuth();
                const dbRef = ref(database, `tariffs/${tariff_type}`);
                await set(dbRef, newTariff);
            } catch (err) {
                next(err);
            }
        } else {
            flag = true;
            break;
        }
    }
    if (!flag) {
        res.status(201).json({
            message: "Tariff created",
            tariffs: { ...tariffs },
        });
    } else {
        res.status(400).json({
            message: "Invalid request in creation of tariff",
        });
    }
};

export const updateTariff = async (req, res, next) => {
    let count = 0;
    for (const [tariff_type, rate] of Object.entries(req.body)) {
        if (rate != "") {
            const updatedTariff = new Tariff(tariff_type, rate);
            try {
                const firebaseApp = firebase.initializeApp(firebaseConfig);
                const database = getDatabase(firebaseApp);
                const auth = getAuth();
                const dbRef = ref(database, `tariffs/${tariff_type}`);
                await set(dbRef, updatedTariff);
            } catch (err) {
                next(err);
            }
        } else {
            count++;
        }
    }
    if (count == Object.keys(req.body).length) {
        res.status(400).json({
            message: "Invalid request in updation of tariff",
        });
    } else {
        res.status(200).json({
            message: "Tariff updated",
        });
    }
};

export const deleteTariff = async (req, res, next) => {
    const tariff_type = req.params.tariff_type;
    try {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();
        const dbRef = ref(database, `tariffs/${tariff_type}`);
        await set(dbRef, null);

        res.status(200).json({
            message: "Tariff deleted",
        });
    } catch (err) {
        next(err);
    }
};

export const getTariff = async (req, res, next) => {
    const tariff_type = req.params.tariff_type;
    try {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();
        const dbRef = ref(database, `tariffs/${tariff_type}`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            res.status(200).json({
                message: "Tariff found",
                tariff: snapshot.val(),
            });
        } else {
            res.status(404).json({
                message: "Tariff not found",
            });
        }
    } catch (err) {
        next(err);
    }
};

export const getTariffs = async (req, res, next) => {
    try {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();
        const dbRef = ref(database, `tariffs`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            res.status(200).json({
                message: "Tariffs found",
                tariffs: snapshot.val(),
            });
        } else {
            res.status(404).json({
                message: "Tariffs not found",
            });
        }
    } catch (err) {
        next(err);
    }
};
