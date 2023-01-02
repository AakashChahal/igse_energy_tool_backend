import * as firebase from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { connect, firebaseConfig } from "../app.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import User from "../models/user.js";

export const register = async (req, res, next) => {
    const {
        first_name,
        last_name,
        customer_id,
        password,
        address,
        property_type,
        num_bedroom,
        balance,
        type,
    } = req.body;
    try {
        const hashedPassword = crypto
            .createHash("sha256")
            .update(password)
            .digest("hex");
        const user = new User(
            customer_id,
            hashedPassword,
            address,
            property_type,
            num_bedroom,
            balance,
            type || "customer"
        );
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            customer_id,
            password
        );
        if (userCredential) {
            const dbRef = ref(
                database,
                `customers/${customer_id
                    .split("@")[0]
                    .replace(/[.#$\\]/g, "_")}`
            );
            await set(dbRef, user);
            res.status(200).json({
                message: "User created",
                user: { ...user },
            });
        } else {
            next(new Error("User not created"));
        }
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    const { customer_id, password } = req.body;
    try {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();

        const userCredential = await signInWithEmailAndPassword(
            auth,
            customer_id,
            password
        );
        if (userCredential) {
            const user = await get(
                ref(
                    database,
                    `customers/${customer_id
                        .split("@")[0]
                        .replace(/[.#$\\]/g, "_")}`
                )
            );

            const isAdmin = user.val().type === "admin";
            const token = jwt.sign(
                {
                    id: user.val()["customer_id"],
                    isAdmin: isAdmin,
                },
                process.env.JWT
            );

            res.cookie("access_token", token, {
                httpOnly: true,
            })
                .status(200)
                .json({
                    message: "User logged in",
                    user: { ...user.val() },
                    isAdmin,
                });
        } else {
            next(new Error("User doesn't exist"));
        }
    } catch (error) {
        next(error);
    }
};
