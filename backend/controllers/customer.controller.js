import Customer from "../models/customer.model.js";

export async function getAllCustomers(req,res) {
    try {
        const customers = await Customer.find();
        return res.status(200).json(customers);
    } catch (error) {
        console.log("ERROR: getAllCustomers @ customer controller");
        return res.status(500).json({ error: "Internal Server Error" });
    }
} 

export async function getCustomerById(req,res) {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({message: "Customer not found"});
        return res.status(200).json(customer);
    } catch (error) {
        console.log("ERROR: getCustomerById @ customer controller");
        return res.status(500).json({ error: "Internal Server Error" });
    }
} 

export async function createCustomer(req,res) {
    try {
        const {name, email} = req.validatedData;

        const newCustomer = await Customer.create({name, email});
        return res.status(201).json({message:"Successfully created customer", newCustomer});
    } catch (error) {
        console.log("ERROR: createCustomer @ customer controller");
        return res.status(500).json({ error: "Internal Server Error" });
    }
} 

export async function deleteCustomer(req,res) {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) return res.status(404).json({message: "Customer not found"});
        return res.status(200).json({message:"Customer successfully deleted"});
    } catch (error) {
        console.log("ERROR: getCustomerById @ customer controller");
        return res.status(500).json({ error: "Internal Server Error" });
    }
}