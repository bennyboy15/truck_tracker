import Worksheet from "../models/worksheet/worksheet.model.js";
import User from "../models/user.model.js";
import Customer from "../models/customer.model.js";
import Truck from "../models/truck/truck.model.js";

export async function getAllWorksheets(req, res) {
    try {
        const { status } = req.query;
        const filter = {};
        if (status && ["draft", "new", "submitted", "modified", "archive"].includes(status)) {
            filter.status = status;
        }
        const worksheets = await Worksheet.find(filter)
            .populate("salesman", "name")
            .populate("customer", "name email")
            .populate("truck");
        return res.status(200).json(worksheets);
    } catch (error) {
        console.log("ERROR: getAllWorksheets @ worksheet controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getWorksheetById(req, res) {
    try {
        const worksheet = await Worksheet.findById(req.params.id)
            .populate("salesman", "name")
            .populate("customer", "name email")
            .populate("truck");
        if (!worksheet) return res.status(404).json({ message: "Worksheet not found" });
        return res.status(200).json(worksheet);
    } catch (error) {
        console.log("ERROR: getWorksheetById @ worksheet controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function createWorksheet(req, res) {
    try {
        const { salesman, customer, truck, extras, status } = req.validatedData;

        const checks = [];
        if (salesman) checks.push(User.findById(salesman));
        if (customer) checks.push(Customer.findById(customer));
        if (truck) checks.push(Truck.findById(truck));

        if (checks.length > 0) {
            const results = await Promise.all(checks);
            if (results.some((r) => r === null)) {
                return res.status(404).json({ message: "One or more referenced entities (Salesman, Customer, or Truck) not found" });
            }
        }

        const newWorksheet = new Worksheet({ salesman, customer, truck, extras, status });
        await newWorksheet.save();
        return res.status(201).json({ message: "Successfully created worksheet", worksheet: newWorksheet });
    } catch (error) {
        console.log("ERROR: createWorksheet @ worksheet controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function updateWorksheet(req, res) {
    try {
        const { id } = req.params;
        const updates = req.validatedData;

        const checks = [];
        if (updates.salesman) checks.push(User.findById(updates.salesman));
        if (updates.customer) checks.push(Customer.findById(updates.customer));
        if (updates.truck) checks.push(Truck.findById(updates.truck));

        if (checks.length > 0) {
            const results = await Promise.all(checks);
            if (results.some((r) => r === null)) {
                return res.status(404).json({ message: "One or more referenced entities not found" });
            }
        }

        const updatedWorksheet = await Worksheet.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedWorksheet) return res.status(404).json({ message: "Worksheet not found" });
        return res.status(200).json({ message: "Worksheet updated successfully", worksheet: updatedWorksheet });
    } catch (error) {
        console.log("ERROR: updateWorksheet @ worksheet controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function deleteWorksheet(req, res) {
    try {
        const deleted = await Worksheet.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Worksheet not found" });
        return res.status(200).json({ message: "Worksheet deleted successfully" });
    } catch (error) {
        console.log("ERROR: deleteWorksheet @ worksheet controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
