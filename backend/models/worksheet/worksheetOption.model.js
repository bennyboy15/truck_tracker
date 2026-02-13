import mongoose from "mongoose";

const worksheetOptionSchema = new mongoose.Schema({
    worksheet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worksheet"
    },
    option: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Option"
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    note: {
        type: String,
    }
}, {timestamps: true});

const WorksheetOption = mongoose.model("WorksheetOption", worksheetOptionSchema);

export default WorksheetOption;