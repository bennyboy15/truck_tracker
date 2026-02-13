import Option from "../models/option.model.js";
import Heading from "../models/heading.model.js";

export async function getAllOptions(req, res) {
    try {
        const { headingId } = req.query;
        const filter = {};
        if (headingId) filter.heading = headingId;
        const options = await Option.find(filter).populate("heading", "name");
        return res.status(200).json(options);
    } catch (error) {
        console.log("ERROR: getAllOptions @ option controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getOptionById(req, res) {
    try {
        const option = await Option.findById(req.params.id).populate("heading", "name");
        if (!option) return res.status(404).json({ message: "Option not found" });
        return res.status(200).json(option);
    } catch (error) {
        console.log("ERROR: getOptionById @ option controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function createOption(req, res) {
    try {
        const data = req.validatedData;

        const foundHeading = await Heading.findById(data.heading);
        if (!foundHeading) return res.status(404).json({ message: "Heading not found" });

        const newOption = new Option(data);
        await newOption.save();
        return res.status(201).json({ message: "Successfully created option", option: newOption });
    } catch (error) {
        console.log("ERROR: createOption @ option controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function updateOption(req, res) {
    try {
        const { id } = req.params;
        const updates = req.validatedData;

        if (updates.heading) {
            const found = await Heading.findById(updates.heading);
            if (!found) return res.status(404).json({ message: "Heading not found" });
        }

        const updated = await Option.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updated) return res.status(404).json({ message: "Option not found" });
        return res.status(200).json({ message: "Option updated successfully", option: updated });
    } catch (error) {
        console.log("ERROR: updateOption @ option controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function deleteOption(req, res) {
    try {
        const deleted = await Option.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Option not found" });
        return res.status(200).json({ message: "Option deleted successfully" });
    } catch (error) {
        console.log("ERROR: deleteOption @ option controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
