import express from "express";
import {getAllTruckModels, getTruckModelById, createTruckModel, deleteTruckModel } from "../controllers/truckModel.controller.js";
import { validate } from "../middleware/validationMiddleware.js";
import { protectRoute } from "../middleware/protectRoute.js";
import {truckModelSchema} from "../schemas/truck.schema.js";

const router = express.Router();

// -- TRUCK MODEL --
router.get("/", protectRoute, getAllTruckModels);
router.get("/:id", protectRoute, getTruckModelById);
router.post("/", protectRoute, validate(truckModelSchema), createTruckModel);
router.delete("/:id", protectRoute, deleteTruckModel);

export default router;