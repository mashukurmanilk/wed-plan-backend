import { setServers } from "node:dns/promises";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import serviceRoutes from "./routes/services.routes.js";
// import transactionRoutes from "./routes/transaction.routes.js";

setServers(["1.1.1.1", "8.8.8.8"]);


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/services", serviceRoutes);
// app.use("/transactions", transactionRoutes);

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});