import mongoose from "mongoose";

const technicianSchema = new mongoose.Schema({

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
    }

}, { timestamps: true });

const Technician = mongoose.model("Technician", technicianSchema);

export default Technician;