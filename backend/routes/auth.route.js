import express from "express";
import { signup, login, logout, checkAuth } from "../controllers/auth.controller.js";
import {protectRoute} from "../middleware/protectRoute.js";
import { validate } from "../middleware/validationMiddleware.js";
import { loginSchema, signupSchema } from "../schemas/auth.schema.js";

const router = express.Router();

router.get("/check-auth", protectRoute, checkAuth);

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

export default router;