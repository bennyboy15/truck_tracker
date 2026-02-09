import Technician from "../models/technician.model.js";

export async function getAllTechnicians(req,res){
    try {
        const techs = await Technician.find();
        return res.status(200).json(techs);
    } catch (error) {
        console.log("ERROR: getAllTechnicians @ technician controller");
        throw new Error("Internal Server Error", 500);
    }
}

export async function getTechnicianById(req,res){
    try {
        const tech = await Technician.findById(req.params.id);
        if (!tech) {
            return res.status(400).json({message: "Technician not found!"});
        }
        return res.status(200).json(tech);
    } catch (error) {
        console.log("ERROR: getTechnicianById @ technician controller");
        throw new Error("Internal Server Error", 500);
    }
}

export async function createTechnician(req,res){
    try {
        const {name, techNo} = req.body;
        if (!name) {
            return res.status(400).json({message: "Missing required fields!"});
        }
        const newTech = new Technician({name, techNo});
        await newTech.save();
        return res.status(200).json(newTech);
    } catch (error) {
        console.log("ERROR: createTechnician @ technician controller");
        throw new Error("Internal Server Error", 500);
    } 
}