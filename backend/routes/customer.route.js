import express from "express";
import { validate } from "../middleware/validationMiddleware.js";
import { customerSchema } from "../schemas/customer.schema.js";
import {getAllCustomers, getCustomerById, createCustomer, deleteCustomer} from "../controllers/customer.controller.js";

const router = express.Router();

router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);

router.post("/", validate(customerSchema), createCustomer);

router.delete("/:id", deleteCustomer);

export default router;