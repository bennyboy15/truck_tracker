import express from "express";
import { getAllOptions, getOptionById, createOption, updateOption, deleteOption } from "../controllers/option.controller.js";
import { optionSchema } from "../schemas/worksheet.schema.js";
import { validate } from "../middleware/validationMiddleware.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getAllOptions);
router.get("/:id", protectRoute, getOptionById);
router.post("/", protectRoute, validate(optionSchema), createOption);
router.put("/:id", protectRoute, validate(optionSchema), updateOption);
router.delete("/:id", protectRoute, deleteOption);

export default router;
