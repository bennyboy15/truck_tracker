import express from "express";
import {getAllTechnicians, getTechnicianById, createTechnician} from "../controllers/technician.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getAllTechnicians);
router.get("/:id", protectRoute, getTechnicianById);
router.post("/", protectRoute, createTechnician);

export default router;