import TruckMake from "../models/truck/truckMake.model.js";

export async function getAllTruckMakes(req, res) {
    try {
        const truckMakes = await TruckMake.find();
        return res.status(200).json(truckMakes);
    } catch (error) {
        console.log("ERROR: getAllTruckMakes @ truckMake controller");
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getTruckMakeById(req, res) {
    try {
        const truckMake = await TruckMake.findById(req.params.id);
        if (!truckMake) return res.status(404).json({ message: "Truck make does not exist" });
        return res.status(200).json(truckMake);
    } catch (error) {
        console.log("ERROR: getTruckMakeById @ truckMake controller");
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function createTruckMake(req, res) {
    try {
        const {name, code} = req.validatedData;
    
        const newTruckMake = await TruckMake.create({name,code});

        return res.status(200).json(newTruckMake);
    } catch (error) {
        console.log("ERROR: createTruckMake @ truckMake controller");
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function deleteTruckMake(req, res) {
    try {
        const { id } = req.params;

        const deletedTruckMake = await TruckMake.findByIdAndDelete(id);

        if (!deletedTruckMake) {
            return res.status(404).json({ message: "Truck make not found" });
        }

        return res.status(200).json({ message: "Truck make deleted successfully" });

    } catch (error) {
        console.error("ERROR: deleteTruckMake @ truck controller", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}