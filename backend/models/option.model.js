import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    heading: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Heading"
    },
    applyTo:{
        type: String,
        required: true
    },
    BOM: {
        type: String,
    },
    description: {
        type: String,
    },
    isFab: {
        type: Boolean,
        default: false
    },
    isGroup: {
        type: Boolean,
        default: false
    },
    labour: {
        type: String,
    },
    labourCost: {
        type: Number, // Stored in cents (1999 = $19.99)
        required: true,
        min: 0
    },
    labourHours: {
        type: Number,
        required: true,
        min: 0
    },
}, {timestamps: true});

const Option = mongoose.model("Option", optionSchema);

export default Option;