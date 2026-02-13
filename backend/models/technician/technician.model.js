import mongoose from "mongoose";

const technicianSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    techNo: {
        type: Number,
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TechnicianTeam"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    
}, {timestamps: true});

const Technician = mongoose.model("Technician", technicianSchema);

export default Technician;