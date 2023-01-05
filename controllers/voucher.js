import Voucher from "../models/Voucher.js";
import * as firebase from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "../app.js";

export const createVoucher = async (req, res, next) => {
    const vouchers = req.body;
    try {
        for (const evc of Object.values(vouchers)) {
            const newVoucher = new Voucher(evc);
            try {
                const firebaseApp = firebase.initializeApp(firebaseConfig);
                const database = getDatabase(firebaseApp);
                const auth = getAuth();
                const dbRef = ref(database, `vouchers/${evc}`);
                await set(dbRef, newVoucher);
            } catch (err) {
                next(err);
            }
        }
        res.status(201).json({
            message: "Voucher(s) created",
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message:
                "Invalid request in creation of voucher (No vouchers provided)",
            status: 400,
            vouchers,
        });
    }
};

export const useVoucher = async (req, res, next) => {
    const { evc } = req.body;
    try {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();
        const dbRef = ref(database, `vouchers/${evc}`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const voucher = snapshot.val();
            if (voucher.used) {
                res.status(400).json({
                    message: "Voucher already used",
                });
            } else {
                updateVoucher(evc);
                res.status(200).json({
                    message: "Voucher used",
                });
            }
        } else {
            res.status(404).json({
                message: "Voucher not found",
            });
        }
    } catch (err) {
        next(err);
    }
};

export const getVouchers = async (req, res, next) => {
    try {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();
        const dbRef = ref(database, `vouchers`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            res.status(200).json({
                message: "Vouchers found",
                vouchers: snapshot.val(),
            });
        } else {
            res.status(404).json({
                message: "Vouchers not found",
            });
        }
    } catch (err) {
        next(err);
    }
};

export const updateVoucher = async (evc) => {
    const updatedVoucher = new Voucher(evc, true);
    try {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();
        const dbRef = ref(database, `vouchers/${evc}`);
        await set(dbRef, updatedVoucher);
    } catch (err) {
        next(err);
    }
};

export const verifyVoucher = async (req, res, next) => {
    const evc = req.body.evc;
    try {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();
        const dbRef = ref(database, `vouchers/${evc}`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const voucher = snapshot.val();
            if (voucher.used) {
                res.status(400).json({
                    message: "Voucher already used",
                });
            } else {
                res.status(200).json({
                    message: "Voucher verified",
                });
            }
        } else {
            res.status(404).json({
                message: "Voucher not found",
                voucher: evc,
            });
        }
    } catch (err) {
        next(err);
    }
};
