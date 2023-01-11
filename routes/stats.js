import express from "express";
import { getStats, getStatsByCustomer } from "../controllers/stats.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", verifyAdmin, getStats);
router.get("/perUser", verifyAdmin, getStatsByCustomer);

export default router;
