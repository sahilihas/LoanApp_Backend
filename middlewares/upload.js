import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "loan_applications",
    resource_type: "auto",
    allowed_formats: ["jpg", "png", "jpeg", "pdf"],
  },
});

export const upload = multer({ storage });
