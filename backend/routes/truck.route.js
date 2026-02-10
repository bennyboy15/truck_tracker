import express from "express";
import {getAllTrucks, getTruckById, createTruck, updateTruck, deleteTruck} from "../controllers/truck.controller.js";
import { truckSchema } from "../schemas/truck.schema.js";
import { validate } from "../middleware/validationMiddleware.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// -- TRUCK --
router.get("/", protectRoute, getAllTrucks);
router.get("/:id", protectRoute, getTruckById);
router.post("/", protectRoute, validate(truckSchema), createTruck);
router.put("/:id", protectRoute, validate(truckSchema), updateTruck);
router.delete("/:id", protectRoute, deleteTruck);

export default router;