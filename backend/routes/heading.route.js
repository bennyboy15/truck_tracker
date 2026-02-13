import express from "express";
import { getAllHeadings, getHeadingById, createHeading, updateHeading, deleteHeading } from "../controllers/heading.controller.js";
import { headingSchema } from "../schemas/worksheet.schema.js";
import { validate } from "../middleware/validationMiddleware.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getAllHeadings);
router.get("/:id", protectRoute, getHeadingById);
router.post("/", protectRoute, validate(headingSchema), createHeading);
router.put("/:id", protectRoute, validate(headingSchema), updateHeading);
router.delete("/:id", protectRoute, deleteHeading);

export default router;
