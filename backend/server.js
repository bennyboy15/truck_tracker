import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import customerRoutes from "./routes/customer.route.js";
import technicianRoutes from "./routes/technician.route.js";
import truckRoutes from "./routes/truck.route.js";
import truckMakeRoutes from "./routes/truckMake.route.js";
import truckModelRoutes from "./routes/truckModel.route.js";
import worksheetRoutes from "./routes/worksheet.route.js";
import worksheetOptionRoutes from "./routes/worksheetOption.route.js";
import headingRoutes from "./routes/heading.route.js";
import sectionRoutes from "./routes/section.route.js";
import optionRoutes from "./routes/option.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// -- CORS -- 
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// -- MIDDLEWARE --
app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

// -- ROUTES --
app.use("/api/auth", authRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/technician", technicianRoutes);
app.use("/api/truck", truckRoutes);
app.use("/api/truck_make", truckMakeRoutes);
app.use("/api/truck_model", truckModelRoutes);
app.use("/api/worksheet", worksheetRoutes);
app.use("/api/worksheet_option", worksheetOptionRoutes);
app.use("/api/heading", headingRoutes);
app.use("/api/section", sectionRoutes);
app.use("/api/option", optionRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	// the '*' character must follow a '/' in express route patterns, use '/*'
	app.get(/.*/, (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	connectDB();
	console.log("Server is running on port: ", PORT);
});