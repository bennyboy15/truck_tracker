import WorksheetOption from "../models/worksheet/worksheetOption.model.js";
import Worksheet from "../models/worksheet/worksheet.model.js";
import Option from "../models/option.model.js";

export async function getAllWorksheetOptions(req, res) {
    try {
        const { worksheetId } = req.query;
        const filter = {};
        if (worksheetId) filter.worksheet = worksheetId;
        const options = await WorksheetOption.find(filter)
            .populate("worksheet")
            .populate("option");
        return res.status(200).json(options);
    } catch (error) {
        console.log("ERROR: getAllWorksheetOptions @ worksheetOption controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getWorksheetOptionById(req, res) {
    try {
        const worksheetOption = await WorksheetOption.findById(req.params.id)
            .populate("worksheet")
            .populate("option");
        if (!worksheetOption) return res.status(404).json({ message: "Worksheet option not found" });
        return res.status(200).json(worksheetOption);
    } catch (error) {
        console.log("ERROR: getWorksheetOptionById @ worksheetOption controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function createWorksheetOption(req, res) {
    try {
        const { worksheet, option, isCompleted, note } = req.validatedData;

        const [foundWorksheet, foundOption] = await Promise.all([
            Worksheet.findById(worksheet),
            Option.findById(option),
        ]);
        if (!foundWorksheet) return res.status(404).json({ message: "Worksheet not found" });
        if (!foundOption) return res.status(404).json({ message: "Option not found" });

        const newWorksheetOption = new WorksheetOption({ worksheet, option, isCompleted, note });
        await newWorksheetOption.save();
        return res.status(201).json({ message: "Successfully created worksheet option", worksheetOption: newWorksheetOption });
    } catch (error) {
        console.log("ERROR: createWorksheetOption @ worksheetOption controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function updateWorksheetOption(req, res) {
    try {
        const { id } = req.params;
        const updates = req.validatedData;

        if (updates.worksheet) {
            const found = await Worksheet.findById(updates.worksheet);
            if (!found) return res.status(404).json({ message: "Worksheet not found" });
        }
        if (updates.option) {
            const found = await Option.findById(updates.option);
            if (!found) return res.status(404).json({ message: "Option not found" });
        }

        const updated = await WorksheetOption.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updated) return res.status(404).json({ message: "Worksheet option not found" });
        return res.status(200).json({ message: "Worksheet option updated successfully", worksheetOption: updated });
    } catch (error) {
        console.log("ERROR: updateWorksheetOption @ worksheetOption controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function deleteWorksheetOption(req, res) {
    try {
        const deleted = await WorksheetOption.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Worksheet option not found" });
        return res.status(200).json({ message: "Worksheet option deleted successfully" });
    } catch (error) {
        console.log("ERROR: deleteWorksheetOption @ worksheetOption controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
