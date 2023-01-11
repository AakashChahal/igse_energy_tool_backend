import express from "express";
import { getStats } from "../controllers/stats.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", verifyAdmin, getStats);

export default router;
