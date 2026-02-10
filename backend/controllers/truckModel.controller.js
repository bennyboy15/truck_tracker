import TruckModel from "../models/truck/truckModel.model.js";

export async function getAllTruckModels(req, res) {
    try {
        const truckModels = await TruckModel.find();
        return res.status(200).json(truckModels);
    } catch (error) {
        console.log("ERROR: getAllTruckModels @ truckMake controller");
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getTruckModelById(req, res) {
    try {
        const truckModel = await TruckModel.findById(req.params.id);
        if (!truckModel) return res.status(404).json({ message: "Truck model does not exist" });
        return res.status(200).json(truckModel);
    } catch (error) {
        console.log("ERROR: getTruckModelById @ truckMake controller");
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function createTruckModel(req, res) {
    try {
        const {name, category, make} = req.validatedData;
        const newTruckModel = await TruckModel.create({name, category, make});
        return res.status(200).json(newTruckModel);
    } catch (error) {
        console.log("ERROR: createTruckModel @ truckMake controller");
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function deleteTruckModel(req, res) {
    try {
        const { id } = req.params;

        const deletedTruckModel = await TruckModel.findByIdAndDelete(id);

        if (!deletedTruckModel) {
            return res.status(404).json({ message: "Truck model not found" });
        }

        return res.status(200).json({ message: "Truck model deleted successfully" });

    } catch (error) {
        console.error("ERROR: deleteTruckModel @ truck controller", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}