import mongoose from "mongoose";

const truckSchema = new mongoose.Schema({

    model: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TruckModel"
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    },
    salesman: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    chassis: {
        type: Number,
        required: true
    },
    stock: {
        type: String,
        required: true
    },
    registration: {
        type: String,
    },
    status: {
        type: String,
        enum: ["active", "upcoming", "completed"],
        default: "active",
    },
    deliveryDate: {
        type: Date,
    },

}, { timestamps: true });

const Truck = mongoose.model("Truck", truckSchema);

export default Truck;