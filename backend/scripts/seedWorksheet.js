import { config } from "dotenv";
import { connectDB } from "../db/connectDB.js";
import Section from "../models/section.model.js";
import Heading from "../models/heading.model.js";
import Option from "../models/option.model.js";
import Worksheet from "../models/worksheet/worksheet.model.js";
import WorksheetOption from "../models/worksheet/worksheetOption.model.js";
import User from "../models/user.model.js";
import Customer from "../models/customer.model.js";
import Truck from "../models/truck/truck.model.js";
import TruckMake from "../models/truck/truckMake.model.js";
import TruckModel from "../models/truck/truckModel.model.js";

config();

async function seedWorksheet() {
    try {
        await connectDB();

        // --- 1. Ensure we have a User, Customer, Truck (create if missing) ---
        let user = await User.findOne();
        if (!user) {
            const [created] = await User.create([
                { email: "test@email.com", password: "password123", name: "Test User" },
            ]);
            user = created;
            console.log("Created user:", user.email);
        } else {
            console.log("Using existing user:", user.email);
        }

        let customer = await Customer.findOne();
        if (!customer) {
            const [created] = await Customer.create([
                { name: "Acme Transport", email: "orders@acme.com" },
            ]);
            customer = created;
            console.log("Created customer:", customer.name);
        } else {
            console.log("Using existing customer:", customer.name);
        }

        let make = await TruckMake.findOne();
        if (!make) {
            const [created] = await TruckMake.create([{ name: "Kenworth", code: "KW" }]);
            make = created;
            console.log("Created truck make:", make.name);
        }
        let model = await TruckModel.findOne({ make: make._id });
        if (!model) {
            const [created] = await TruckModel.create([
                { name: "K220", category: "KW", make: make._id },
            ]);
            model = created;
            console.log("Created truck model:", model.name);
        }

        let truck = await Truck.findOne();
        if (!truck) {
            const [created] = await Truck.create([
                {
                    model: model._id,
                    customer: customer._id,
                    salesman: user._id,
                    chassis: 475645,
                    stock: "STK-001",
                    registration: "ABC-123",
                    status: "active",
                },
            ]);
            truck = created;
            console.log("Created truck:", truck.stock);
        } else {
            console.log("Using existing truck:", truck.stock);
        }

        // --- 2. Clear and rebuild Section → Heading → Option (template) ---
        await WorksheetOption.deleteMany({});
        await Worksheet.deleteMany({});
        await Option.deleteMany({});
        await Heading.deleteMany({});
        await Section.deleteMany({});
        console.log("Cleared sections, headings, options, worksheets, worksheet options.");

        const sections = await Section.insertMany([
            { name: "Chassis" },
            { name: "Body" },
            { name: "Paint & Signage" },
        ]);
        console.log("Created sections:", sections.map((s) => s.name).join(", "));

        const chassisSection = sections.find((s) => s.name === "Chassis");
        const bodySection = sections.find((s) => s.name === "Body");
        const paintSection = sections.find((s) => s.name === "Paint & Signage");

        const headings = await Heading.insertMany([
            { name: "Engine", section: chassisSection._id },
            { name: "Transmission", section: chassisSection._id },
            { name: "Body Type", section: bodySection._id },
            { name: "Lining", section: bodySection._id },
            { name: "Paint", section: paintSection._id },
            { name: "Signage", section: paintSection._id },
        ]);
        console.log("Created headings:", headings.length);

        const engineHeading = headings.find((h) => h.name === "Engine");
        const transmissionHeading = headings.find((h) => h.name === "Transmission");
        const bodyTypeHeading = headings.find((h) => h.name === "Body Type");
        const liningHeading = headings.find((h) => h.name === "Lining");
        const paintHeading = headings.find((h) => h.name === "Paint");
        const signageHeading = headings.find((h) => h.name === "Signage");

        const options = await Option.insertMany([
            { name: "Euro 6 Engine", heading: engineHeading._id, applyTo: "all", labourCost: 0, labourHours: 0, description: "Standard Euro 6" },
            { name: "Upgraded Cooling", heading: engineHeading._id, applyTo: "all", labourCost: 15000, labourHours: 4, description: "Heavy-duty cooling pack" },
            { name: "PTO Option", heading: engineHeading._id, applyTo: "all", labourCost: 25000, labourHours: 8, description: "Power take-off" },
            { name: "6-Speed Manual", heading: transmissionHeading._id, applyTo: "all", labourCost: 0, labourHours: 0, description: "Standard gearbox" },
            { name: "8-Speed Auto", heading: transmissionHeading._id, applyTo: "all", labourCost: 45000, labourHours: 12, description: "Automatic transmission" },
            { name: "Tray Body", heading: bodyTypeHeading._id, applyTo: "all", labourCost: 120000, labourHours: 40, description: "Steel tray" },
            { name: "Tipper Body", heading: bodyTypeHeading._id, applyTo: "all", labourCost: 180000, labourHours: 56, description: "Hydraulic tipper" },
            { name: "Plywood Lining", heading: liningHeading._id, applyTo: "all", labourCost: 8000, labourHours: 6, description: "Full ply lining" },
            { name: "Aluminium Lining", heading: liningHeading._id, applyTo: "all", labourCost: 15000, labourHours: 10, description: "Aluminium interior" },
            { name: "Standard White", heading: paintHeading._id, applyTo: "all", labourCost: 0, labourHours: 0, description: "Solid white" },
            { name: "Two-Pack Metallic", heading: paintHeading._id, applyTo: "all", labourCost: 22000, labourHours: 16, description: "Metallic finish" },
            { name: "No Signage", heading: signageHeading._id, applyTo: "all", labourCost: 0, labourHours: 0, description: "Plain" },
            { name: "Basic Lettering", heading: signageHeading._id, applyTo: "all", labourCost: 5000, labourHours: 4, description: "Company name and number" },
        ]);
        console.log("Created options:", options.length);

        // --- 3. Create a worksheet for the truck and "pick" options (build the worksheet) ---
        const worksheet = await Worksheet.create({
            salesman: user._id,
            customer: customer._id,
            truck: truck._id,
            extras: "Customer requested delivery by end of month.",
            status: "draft",
        });
        console.log("Created worksheet for truck:", truck.stock);

        // Pick a subset of options to build the worksheet (simulate user selecting options)
        const chosenOptionIds = [
            options.find((o) => o.name === "Euro 6 Engine")._id,
            options.find((o) => o.name === "Upgraded Cooling")._id,
            options.find((o) => o.name === "6-Speed Manual")._id,
            options.find((o) => o.name === "Tray Body")._id,
            options.find((o) => o.name === "Plywood Lining")._id,
            options.find((o) => o.name === "Standard White")._id,
            options.find((o) => o.name === "Basic Lettering")._id,
        ];

        const worksheetOptions = chosenOptionIds.map((optionId, index) => ({
            worksheet: worksheet._id,
            option: optionId,
            isCompleted: index < 2, // first two marked done for demo
            note: index === 0 ? "Confirmed with workshop" : undefined,
        }));
        await WorksheetOption.insertMany(worksheetOptions);
        console.log("Added", worksheetOptions.length, "options to worksheet (selected options for this truck).");

        console.log("\nSeed complete. Worksheet ID:", worksheet._id.toString());
        process.exit(0);
    } catch (error) {
        console.error("Error seeding worksheet:", error);
        process.exit(1);
    }
}

seedWorksheet();
