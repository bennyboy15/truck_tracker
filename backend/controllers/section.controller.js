import Section from "../models/section.model.js";

export async function getAllSections(req, res) {
    try {
        const sections = await Section.find();
        return res.status(200).json(sections);
    } catch (error) {
        console.log("ERROR: getAllSections @ section controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getSectionById(req, res) {
    try {
        const section = await Section.findById(req.params.id);
        if (!section) return res.status(404).json({ message: "Section not found" });
        return res.status(200).json(section);
    } catch (error) {
        console.log("ERROR: getSectionById @ section controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function createSection(req, res) {
    try {
        const { name } = req.validatedData;
        const newSection = new Section({ name });
        await newSection.save();
        return res.status(201).json({ message: "Successfully created section", section: newSection });
    } catch (error) {
        console.log("ERROR: createSection @ section controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function updateSection(req, res) {
    try {
        const updated = await Section.findByIdAndUpdate(
            req.params.id,
            { $set: req.validatedData },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: "Section not found" });
        return res.status(200).json({ message: "Section updated successfully", section: updated });
    } catch (error) {
        console.log("ERROR: updateSection @ section controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function deleteSection(req, res) {
    try {
        const deleted = await Section.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Section not found" });
        return res.status(200).json({ message: "Section deleted successfully" });
    } catch (error) {
        console.log("ERROR: deleteSection @ section controller", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
