import express from "express";
import {
    createTariff,
    deleteTariff,
    getTariff,
    getTariffs,
    updateTariff,
} from "../controllers/tariff.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/", verifyAdmin, createTariff);
// UPDATE
router.put("/:tariff_type", verifyAdmin, updateTariff);
// DELETE
router.delete("/:tariff_type", verifyAdmin, deleteTariff);

// READ
router.get("/:tariff_type", verifyAdmin, getTariff);

// READ ALL
router.get("/", verifyUser, getTariffs);

export default router;
