import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

import {
  createLoanApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats,
} from "../controllers/loanForm.controller.js";

/*CLOUDINARY CONFIG*/
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/*CLOUDINARY CONFIG*/
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "loan-applications",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const router = express.Router();

/*CLOUDINARY CONFIG*/

// GET /api/loan-forms/stats
router.get("/stats", getApplicationStats);

// POST /api/loan-forms (WITH FILE UPLOADS)
router.post(
  "/",
  upload.fields([
    { name: "idDocument", maxCount: 1 },
    { name: "businessDocs", maxCount: 5 },
    { name: "bankStatements", maxCount: 5 },
    { name: "ownerIds", maxCount: 5 },
  ]),
  createLoanApplication
);

// GET /api/loan-forms
router.get("/", getAllApplications);

// GET /api/loan-forms/:id
router.get("/:id", getApplicationById);

// PUT /api/loan-forms/:id/status
router.put("/:id/status", updateApplicationStatus);

// DELETE /api/loan-forms/:id
router.delete("/:id", deleteApplication);

export default router;
