import express from "express";
import {getAllTechnicians, getTechnicianById, createTechnician} from "../controllers/technician.controller.js";

const router = express.Router();

router.get("/", getAllTechnicians);
router.get("/:id", getTechnicianById);
router.post("/", createTechnician);

export default router;