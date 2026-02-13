import express from "express";
import {
    getAllWorksheetOptions,
    getWorksheetOptionById,
    createWorksheetOption,
    updateWorksheetOption,
    deleteWorksheetOption,
} from "../controllers/worksheetOption.controller.js";
import { worksheetOptionSchema } from "../schemas/worksheet.schema.js";
import { validate } from "../middleware/validationMiddleware.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getAllWorksheetOptions);
router.get("/:id", protectRoute, getWorksheetOptionById);
router.post("/", protectRoute, validate(worksheetOptionSchema), createWorksheetOption);
router.put("/:id", protectRoute, validate(worksheetOptionSchema), updateWorksheetOption);
router.delete("/:id", protectRoute, deleteWorksheetOption);

export default router;
