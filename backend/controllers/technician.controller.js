import Technician from "../models/technician/technician.model.js";

export async function getAllTechnicians(req,res){
    try {
        const techs = await Technician.find();
        return res.status(200).json(techs);
    } catch (error) {
        console.log("ERROR: getAllTechnicians @ technician controller");
        return res.status(500).json({message:"Internal Server Error"});
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
        return res.status(500).json({message:"Internal Server Error"});
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
        return res.status(500).json({message:"Internal Server Error"});
    } 
}