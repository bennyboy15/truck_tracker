import express from "express";
import {getAllTruckMakes, getTruckMakeById, createTruckMake, deleteTruckMake } from "../controllers/truckMake.controller.js";
import { validate } from "../middleware/validationMiddleware.js";
import { protectRoute } from "../middleware/protectRoute.js";
import {truckMakeSchema} from "../schemas/truck.schema.js";

const router = express.Router();

// -- TRUCK MAKE --
router.get("/", protectRoute, getAllTruckMakes);
router.get("/:id", protectRoute, getTruckMakeById);
router.post("/", protectRoute, validate(truckMakeSchema), createTruckMake);
router.delete("/:id", protectRoute, deleteTruckMake);

export default router;