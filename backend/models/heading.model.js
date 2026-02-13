import mongoose from "mongoose";

const headingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section"
    },
}, {timestamps: true});

const Heading = mongoose.model("Heading", headingSchema);

export default Heading;