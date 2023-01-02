import express from "express";
import {
    deleteUser,
    getUser,
    getUsers,
    updateUser,
} from "../controllers/users.js";
import { verifyToken, verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// middleqare
// router.get("/checkAuth", verifyToken, (req, res, next) => {
//     res.status(200).json({
//         message: "User authenticated",
//     });
// });

// router.get("/checkUser/:customer_id", verifyUser, (req, res, next) => {
//     res.send("You are authorized to view this page");
// });

// router.get("/checkAdmin/:customer_id", verifyAdmin, (req, res, next) => {
//     res.send("You are authorized to view the admin page");
// });

// UPDATE
router.put("/:customer_id", verifyUser, updateUser);
// DELETE
router.delete("/:customer_id", verifyUser, deleteUser);

// READ
router.get("/:customer_id", verifyUser, getUser);

// READ ALL
router.get("/", verifyAdmin, getUsers);

export default router;
