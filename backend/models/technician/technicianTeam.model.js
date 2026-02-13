import mongoose from "mongoose";

const technicianTeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
}, {timestamps: true});

const TechnicianTeam = mongoose.model("TechnicianTeam", technicianTeamSchema);

export default TechnicianTeam;