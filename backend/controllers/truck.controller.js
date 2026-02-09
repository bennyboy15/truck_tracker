import Truck from "../models/truck.model.js";
import TruckModel from "../models/truckModel.model.js";
import Customer from "../models/customer.model.js";
import User from "../models/user.model.js";

export async function getAllTrucks(req, res) {
    try {
        const trucks = await Trucks.find();
        return res.status(200).json(trucks);
    } catch (error) {
        console.log("ERROR: getAllTrucks @ truck controller");
        throw new Error("Internal Server Error", 500);
    }
}

export async function getTruckById(req, res) {
    try {
        const truck = await Trucks.findById(req.params.id);
        return res.status(200).json(truck);
    } catch (error) {
        console.log("ERROR: getTruckById @ truck controller");
        throw new Error("Internal Server Error", 500);
    }
}

export async function createTruck(req, res) {
    try {
        const {model, customer, salesman, chassis, stock, registration} = req.validatedData;
        
        const foundModel = await TruckModel.findById(model);
        if (!foundModel) return res.status(400).json({message: "Model does not exist"});

        const foundCustomer = await Customer.findById(customer);
        if (!foundCustomer) return res.status(400).json({message: "Customer does not exist"});

        const foundSalesman = await User.findById(salesman);
        if (!foundSalesman) return res.status(400).json({message: "Salesman does not exist"});

        const newTruck = new Truck({model, customer, salesman, chassis, stock, registration});
        await newTruck.save();

        return res.status(201).json({message:"Successfully created new truck", truck:newTruck});

    } catch (error) {
        console.log("ERROR: createTruck @ truck controller");
        throw new Error("Internal Server Error", 500);
    }
}

export async function updateTruck(req, res) {

}

export async function deleteTruck(req, res) {

}