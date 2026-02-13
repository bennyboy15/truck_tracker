import Heading from "../models/heading.model.js";
import Section from "../models/section.model.js";

export async function getAllHeadings(req, res) {
    try {
        const { sectionId } = req.query;
        const filter = {};
        if (sectionId) filter.section = sectionId;
        const headings = await Heading.find(filter).populate("section", "name");
        return res.status(200).json(headings);
    } catch (error) {
        console.log("ERROR: getAllHeadings @ heading controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getHeadingById(req, res) {
    try {
        const heading = await Heading.findById(req.params.id).populate("section", "name");
        if (!heading) return res.status(404).json({ message: "Heading not found" });
        return res.status(200).json(heading);
    } catch (error) {
        console.log("ERROR: getHeadingById @ heading controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function createHeading(req, res) {
    try {
        const { name, section } = req.validatedData;

        const foundSection = await Section.findById(section);
        if (!foundSection) return res.status(404).json({ message: "Section not found" });

        const newHeading = new Heading({ name, section });
        await newHeading.save();
        return res.status(201).json({ message: "Successfully created heading", heading: newHeading });
    } catch (error) {
        console.log("ERROR: createHeading @ heading controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function updateHeading(req, res) {
    try {
        const { id } = req.params;
        const updates = req.validatedData;

        if (updates.section) {
            const found = await Section.findById(updates.section);
            if (!found) return res.status(404).json({ message: "Section not found" });
        }

        const updated = await Heading.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updated) return res.status(404).json({ message: "Heading not found" });
        return res.status(200).json({ message: "Heading updated successfully", heading: updated });
    } catch (error) {
        console.log("ERROR: updateHeading @ heading controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function deleteHeading(req, res) {
    try {
        const deleted = await Heading.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Heading not found" });
        return res.status(200).json({ message: "Heading deleted successfully" });
    } catch (error) {
        console.log("ERROR: deleteHeading @ heading controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
