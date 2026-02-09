import mongoose from "mongoose";

const truckModelSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    make: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TruckMake"
    }
    
}, {timestamps: true});

const TruckModel = mongoose.model("TruckModel", truckModelSchema);

export default TruckModel;