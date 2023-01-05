import express from "express";
import {
    createVoucher,
    getVouchers,
    useVoucher,
    verifyVoucher,
} from "../controllers/voucher.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// create voucher(s)
router.post("/", verifyAdmin, createVoucher);

// get all vouchers
router.get("/", verifyAdmin, getVouchers);

// use a voucher
router.post("/use", useVoucher);

// verify a voucher
router.post("/verify", verifyVoucher);

export default router;
