import express from "express";
import Tariff from "../models/Tariff.js";
import * as firebase from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { connect, firebaseConfig } from "../app.js";

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
    const newTariff = new Tariff(req.body.tariff_type, req.body.rate);
    try {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();
        const dbRef = ref(database, `tariffs/${newTariff.tariff_type}`);
        await set(dbRef, newTariff);

        res.status(200).json({
            message: "Tariff created",
            tariff: { ...newTariff },
        });
    } catch (err) {
        res.status(500).json(err);
    }
});
// UPDATE
router.put("/:tariff_type", async (req, res) => {
    const tariff_type = req.params.tariff_type;
    const updatedTariff = new Tariff(
        req.body.tariff_type || tariff_type,
        req.body.rate
    );
    try {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();
        const dbRef = ref(database, `tariffs/${tariff_type}`);
        await set(dbRef, updatedTariff);

        res.status(200).json({
            message: "Tariff updated",
            tariff: { ...updatedTariff },
        });
    } catch (err) {
        res.status(500).json(err);
    }
});
// DELETE
router.delete("/:tariff_type", async (req, res) => {
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
        res.status(500).json(err);
    }
});

// READ
router.get("/:tariff_type", async (req, res) => {
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
        res.status(500).json(err);
    }
});

// READ ALL
router.get("/", async (req, res) => {
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
        res.status(500).json(err);
    }
});

export default router;