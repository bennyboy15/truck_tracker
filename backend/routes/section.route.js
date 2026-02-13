import express from "express";
import { getAllSections, getSectionById, createSection, updateSection, deleteSection } from "../controllers/section.controller.js";
import { sectionSchema } from "../schemas/worksheet.schema.js";
import { validate } from "../middleware/validationMiddleware.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getAllSections);
router.get("/:id", protectRoute, getSectionById);
router.post("/", protectRoute, validate(sectionSchema), createSection);
router.put("/:id", protectRoute, validate(sectionSchema), updateSection);
router.delete("/:id", protectRoute, deleteSection);

export default router;
