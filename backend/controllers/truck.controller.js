import Truck from "../models/truck/truck.model.js";
import TruckModel from "../models/truck/truckModel.model.js";
import Customer from "../models/customer.model.js";
import User from "../models/user.model.js";

export async function getAllTrucks(req, res) {
    try {
        const trucks = await Truck.find();
        return res.status(200).json(trucks);
    } catch (error) {
        console.log("ERROR: getAllTrucks @ truck controller");
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getTruckById(req, res) {
    try {
        const truck = await Trucks.findById(req.params.id);
        if (!truck) return res.status(404).json({ message: "Truck not found" });
        return res.status(200).json(truck);
    } catch (error) {
        console.log("ERROR: getTruckById @ truck controller");
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function createTruck(req, res) {
    try {
        const { model, customer, salesman, chassis, stock, registration } = req.validatedData;

        // Run all existence checks in parallel
        const [foundModel, foundCustomer, foundSalesman] = await Promise.all([
            TruckModel.findById(model),
            Customer.findById(customer),
            User.findById(salesman)
        ]);

        // Validate results
        if (!foundModel) return res.status(404).json({ message: "Model does not exist" });
        if (!foundCustomer) return res.status(404).json({ message: "Customer does not exist" });
        if (!foundSalesman) return res.status(404).json({ message: "Salesman does not exist" });

        const newTruck = new Truck({ model, customer, salesman, chassis, stock, registration });
        await newTruck.save();

        return res.status(201).json({ message: "Successfully created new truck", truck: newTruck });

    } catch (error) {
        console.log("ERROR: createTruck @ truck controller");
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function updateTruck(req, res) {
    try {
        const { id } = req.params;
        const updates = req.validatedData;

        const checks = [];
        if (updates.model) checks.push(TruckModel.findById(updates.model));
        if (updates.customer) checks.push(Customer.findById(updates.customer));
        if (updates.salesman) checks.push(User.findById(updates.salesman));

        if (checks.length > 0) {
            const results = await Promise.all(checks);
            if (results.includes(null)) {
                return res.status(404).json({ message: "One or more referenced entities (Model, Customer, or Salesman) not found" });
            }
        }

        const updatedTruck = await Truck.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true } 
        );

        if (!updatedTruck) {
            return res.status(404).json({ message: "Truck not found" });
        }

        return res.status(200).json({ 
            message: "Truck updated successfully", 
            truck: updatedTruck 
        });

    } catch (error) {
        console.error("ERROR: updateTruck @ truck controller", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteTruck(req, res) {
    try {
        const { id } = req.params;

        const deletedTruck = await Truck.findByIdAndDelete(id);

        if (!deletedTruck) {
            return res.status(404).json({ message: "Truck not found" });
        }

        return res.status(200).json({ message: "Truck deleted successfully" });

    } catch (error) {
        console.error("ERROR: deleteTruck @ truck controller", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}