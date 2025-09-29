import Customer from "../models/customer.model.js";
import mongoose from "mongoose";

export const createCustomer = async (req, res) => {
	const customer = req.body;
	if (!customer.name || !customer.phoneNumber || !customer.address || !customer.product) {
		return res.status(400).json({ success: false, message: "Please provide all fields" });
	}
	const newCustomer = new Customer(customer);

	try {
		await newCustomer.save();
		res.status(201).json({ success: true, data: newCustomer });
	} catch (error) {
		console.error("Error in Create customer:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getCustomers = async (req, res) => {
	try {
		const customers = await Customer.find({}).sort({ createdAt: -1 });
		res.status(200).json({ success: true, data: customers });
	} catch (error) {
		console.log("error in fetching customers:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteCustomer = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(404).json({ success: false, message: "Invalid Product Id" });
	}
	try {
		await Customer.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Customer deleted successfully" });
	} catch (error) {
		console.log("Error in deleting customer:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
}

export const updateCustomerStatus = async (req, res) => {
	const { id } = req.params;
	const { status } = req.body;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Customer Id" });
	}
	if (!["pending", "processing", "done"].includes(status)) {
		return res.status(400).json({ success: false, message: "Invalid status value" });
	}
	try {
		const updatedCustomer = await Customer.findByIdAndUpdate(
			id,
			{ status },
			{ new: true }
		);
		if (!updatedCustomer) {
			return res.status(404).json({ success: false, message: "Customer not found" });
		}
		res.status(200).json({ success: true, data: updatedCustomer });
	} catch (error) {
		console.log("Error in updating customer status:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
}