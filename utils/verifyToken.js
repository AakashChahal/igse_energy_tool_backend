import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return next(createError("Access denied", 401));
    }

    jwt.verify(token, process.env.JWT, (err, decoded) => {
        if (err) {
            return next(createError(err, 401));
        }

        req.user = decoded;
        next();
    });
};

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.id === req.params.customer_id || req.user.isAdmin) {
            next();
        } else {
            next(createError("You are not authorized", 401));
        }
    });
};

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            next(createError("You are not authorized", 401));
        }
    });
};
