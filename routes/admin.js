import express from "express";
import { calcEnergy, countProperties } from "../controllers/igse.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/home", (req, res, next) => {
    res.status(200).json({
        message: "Welcome to the IGSE admin API",
        queriesAvailable: [
            "GET /propertyCount",
            "GET /",
            "GET /{propertyType}/{numBedrooms}",
        ],
    });
});

export default router;
