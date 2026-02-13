import mongoose from "mongoose";

const worksheetSchema = new mongoose.Schema({
    salesman: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    },
    truck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Truck"
    },  
    extras: {
        type: String,
    },
    status: {
        type: String,
        enum: ["draft", "new", "submitted", "modified", "archive"],
        default: "draft",
    },
}, {timestamps: true});

const Worksheet = mongoose.model("Worksheet", worksheetSchema);

export default Worksheet;