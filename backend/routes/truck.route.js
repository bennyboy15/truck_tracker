import express from "express";
import {getAllTrucks, getTruckById, createTruck, updateTruck, deleteTruck} from "../controllers/truck.controller.js";
import { truckSchema } from "../schemas/truck.schema.js";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.get("/", getAllTrucks);
router.get("/:id", getTruckById);

router.post("/", validate(truckSchema), createTruck);

router.put("/:id", validate(truckSchema), updateTruck);

router.delete("/:id", deleteTruck);

export default router;