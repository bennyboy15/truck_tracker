import mongoose from "mongoose";

const technicianSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    techNo: {
        type: Number,
    },
    
}, {timestamps: true});

const Technician = mongoose.model("Technician", technicianSchema);

export default Technician;