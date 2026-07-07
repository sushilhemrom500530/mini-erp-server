import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/user/user.model";

dotenv.config();

async function checkUsers() {
  await mongoose.connect(
    process.env.DATABASE_URL || "mongodb://localhost:27017/ticket-platform",
  );
  const count = await User.countDocuments();
  console.log(`Total users: ${count}`);
  const organizers = await User.find({ role: "admin" });
  console.log(`Organizers: ${organizers.length}`);
  console.log(JSON.stringify(organizers, null, 2));
  await mongoose.disconnect();
}

checkUsers().catch(console.error);
