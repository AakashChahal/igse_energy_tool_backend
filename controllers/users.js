import Tariff from "../models/Tariff.js";
import * as firebase from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "../app.js";

export const updateUser = async (req, res, next) => {
    const user = req.params.customer_id.split("@")[0].replace(/[.#$\\]/g, "_");
    const updatedUser = new User({ ...req.body });
    try {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();
        const dbRef = ref(database, `customers/${user}`);
        await set(dbRef, updatedUser);

        res.status(200).json({
            message: "Tariff updated",
            tariff: { ...updatedUser },
        });
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req, res, next) => {
    const user = req.params.customer_id.split("@")[0].replace(/[.#$\\]/g, "_");
    try {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();
        const dbRef = ref(database, `customers/${user}`);
        await set(dbRef, null);

        res.status(200).json({
            message: "user deleted",
        });
    } catch (err) {
        next(err);
    }
};

export const getUser = async (req, res, next) => {
    const user = req.params.customer_id.split("@")[0].replace(/[.#$\\]/g, "_");
    try {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();
        const dbRef = ref(database, `customers/${user}`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            res.status(200).json({
                message: "User found",
                user: snapshot.val(),
            });
        } else {
            res.status(404).json({
                message: "User not found",
            });
        }
    } catch (err) {
        next(err);
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();
        const dbRef = ref(database, `customers`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            res.status(200).json({
                message: "Users found",
                users: snapshot.val(),
            });
        } else {
            res.status(404).json({
                message: "Users not found",
            });
        }
    } catch (err) {
        next(err);
    }
};
