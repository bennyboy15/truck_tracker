import mongoose from "mongoose";

const truckMakeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    }
    
}, {timestamps: true});

const TruckMake = mongoose.model("TruckMake", truckMakeSchema);

export default TruckMake;