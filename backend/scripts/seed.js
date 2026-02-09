import { config } from "dotenv";
import { connectDB } from "../db/connectDB.js";
import User from "../models/user.model.js";

config();

const users = [
    { email: "test@email.com", password: "password123", name: "Test User" },
    { email: "alex.dev@provider.com", password: "secure_hash_88b", name: "Alex Rivera" },
    { email: "sarah.smith@company.org", password: "login_token_99x", name: "Sarah Smith" },
    { email: "jordan.t@webmail.net", password: "hidden_pass_44", name: "Jordan Taylor" }
];

async function seedDatabase() {
    try {
        await connectDB();
        
        // 1. Clean the slate so you don't get 'Email already exists' errors
        await User.deleteMany({});
        console.log("Old users cleared.");

        // 2. Insert the new data
        await User.insertMany(users);
        console.log("All users saved successfully!");

        // 3. Gracefully exit
        process.exit(0); 
    } catch (error) {
        console.error("Error seeding users:", error);
        process.exit(1); // Exit with failure code
    }
}

seedDatabase();