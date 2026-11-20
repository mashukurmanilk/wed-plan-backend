import cors from "cors";
import express from "express";
// import { createService, getAllServices, getServiceById, updateService, deleteService } from "../controllers/services.controller.js";
// import { authenticateToken } from "../middleware/auth.middleware.js";
import { getAllServices } from "../controllers/services.controller.js";

const router = express.Router();

router.use(cors());

router.get("/", getAllServices);
// router.get("/:id", authenticateToken, getServiceById);
// router.post("/", authenticateToken, createService);
// router.put("/:id", authenticateToken, updateService);
// router.delete("/:id", authenticateToken, deleteService);

export default router;
