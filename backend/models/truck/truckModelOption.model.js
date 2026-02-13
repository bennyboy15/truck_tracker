import mongoose from "mongoose";

const truckModelOptionSchema = new mongoose.Schema({
    truckModel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TruckModel"
    },
    option: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Option"
    },
}, {timestamps: true});

const TruckModelOption = mongoose.model("TruckModelOption", truckModelOptionSchema);

export default TruckModelOption;