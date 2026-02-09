import Truck from "../models/truck.model.js";

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
        const {model, customer, salesman, chassis, stock, registration} = req.body;
        
    } catch (error) {
        console.log("ERROR: createTruck @ truck controller");
        throw new Error("Internal Server Error", 500);
    }
}

export async function updateTruck(req, res) {

}

export async function deleteTruck(req, res) {

}