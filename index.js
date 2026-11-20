import { setServers } from "node:dns/promises";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import serviceRoutes from "./routes/services.routes.js";
import bookingRoutes from "./routes/bookings.routes.js";
import userRoutes from "./routes/users.routes.js";
import transactionRoutes from "./routes/transactions.routes.js";
import { seedDatabase } from "./controllers/users.controller.js";

import User from "./models/User.js";
import Service from "./models/Services.js";
import Booking from "./models/Bookings.js";
import Transaction from "./models/Transaction.js";
import {
  INITIAL_USERS,
  INITIAL_SERVICES,
  INITIAL_BOOKINGS,
  INITIAL_TRANSACTIONS,
} from "./data/seedData.js";

// Ensure DNS resolves correctly for MongoDB SRV on Windows
try {
  setServers(["1.1.1.1", "8.8.8.8"]);
} catch (e) {
  console.warn("Notice setting DNS servers:", e.message);
}

dotenv.config();

const app = express();

// Enable CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Health check endpoints
app.get(["/health", "/api/health"], (req, res) => {
  return res.status(200).json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "connecting/disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Seed endpoint
app.post(["/seed", "/api/seed"], seedDatabase);

// Resource routes (both prefixed and non-prefixed for maximum compatibility)
app.use("/services", serviceRoutes);
app.use("/api/services", serviceRoutes);

app.use("/bookings", bookingRoutes);
app.use("/api/bookings", bookingRoutes);

app.use("/users", userRoutes);
app.use("/api/users", userRoutes);

app.use("/transactions", transactionRoutes);
app.use("/api/transactions", transactionRoutes);

// Auto-seed helper when DB connects
const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    const serviceCount = await Service.countDocuments();

    if (userCount === 0) {
      await User.insertMany(INITIAL_USERS);
      console.log("Auto-seeded initial users into MongoDB");
    }
    if (serviceCount === 0) {
      await Service.insertMany(INITIAL_SERVICES);
      console.log("Auto-seeded initial services into MongoDB");
    }
    const bookingCount = await Booking.countDocuments();
    if (bookingCount === 0) {
      await Booking.insertMany(INITIAL_BOOKINGS);
      console.log("Auto-seeded initial bookings into MongoDB");
    }
    const txnCount = await Transaction.countDocuments();
    if (txnCount === 0) {
      await Transaction.insertMany(INITIAL_TRANSACTIONS);
      console.log("Auto-seeded initial transactions into MongoDB");
    }
  } catch (err) {
    console.warn("Notice auto-seeding database:", err.message);
  }
};

const MONGO_URI =
  process.env.MONGODB_URI ||
  " ";

mongoose
  .connect(MONGO_URI, {
    dbName: "wedplan",
  })
  .then(async () => {
    console.log("Connected to MongoDB Atlas (wedplan database)");
    await autoSeedIfEmpty();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

const db = mongoose.connection;
db.on("error", (err) => {
  console.error("MongoDB runtime error:", err.message);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`WedPlan Express API server listening on http://localhost:${PORT}`);
});

export default app;
