import express from "express";
import {
    createTariff,
    deleteTariff,
    getTariff,
    getTariffs,
    updateTariff,
} from "../controllers/tariff.js";

const router = express.Router();

// CREATE
router.post("/", createTariff);
// UPDATE
router.put("/:tariff_type", updateTariff);
// DELETE
router.delete("/:tariff_type", deleteTariff);

// READ
router.get("/:tariff_type", getTariff);

// READ ALL
router.get("/", getTariffs);

export default router;
