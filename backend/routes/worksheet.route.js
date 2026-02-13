import express from "express";
import { getAllWorksheets, getWorksheetById, createWorksheet, updateWorksheet, deleteWorksheet } from "../controllers/worksheet.controller.js";
import { worksheetSchema } from "../schemas/worksheet.schema.js";
import { validate } from "../middleware/validationMiddleware.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getAllWorksheets);
router.get("/:id", protectRoute, getWorksheetById);
router.post("/", protectRoute, validate(worksheetSchema), createWorksheet);
router.put("/:id", protectRoute, validate(worksheetSchema), updateWorksheet);
router.delete("/:id", protectRoute, deleteWorksheet);

export default router;
