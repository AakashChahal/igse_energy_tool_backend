import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("this is the meter readings route");
});

export default router;
