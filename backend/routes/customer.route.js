import express from "express";
import { createCustomer, deleteCustomer, getCustomers, updateCustomerStatus } from "../controllers/customer.controller.js";

const router = express.Router();


router.post("/", createCustomer);
router.get("/", getCustomers);
router.delete("/:id", deleteCustomer);
router.patch("/:id", updateCustomerStatus);

export default router;