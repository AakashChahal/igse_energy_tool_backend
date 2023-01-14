import express from "express";
import {
    createReading,
    getReading,
    getReadings,
    updateReading,
} from "../controllers/reading.js";
import { verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/", verifyUser, createReading);

// UPDATE
router.put("/:customer_id/:reading_id", verifyUser, updateReading);

// DELETE
// router.delete("/:customer_id:reading_date", verifyUser, deleteReading);

// READ
router.get("/:customer_id", verifyUser, getReading);

// READ ALL
router.get("/", verifyAdmin, getReadings);

export default router;
