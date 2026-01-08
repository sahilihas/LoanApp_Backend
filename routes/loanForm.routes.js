import express from "express";
import {
  createStepOne,
  updateStepTwo,
  updateStepThree,
  updateStepFour,
  updateStepFive,
  getLoanApplication,
} from "../controllers/loanForm.controller.js";

const router = express.Router();

router.post("/step-1", createStepOne);
router.put("/step-2/:id", updateStepTwo);
router.put("/step-3/:id", updateStepThree);
router.put("/step-4/:id", updateStepFour);
router.put("/step-5/:id", updateStepFive);

router.get("/:id", getLoanApplication);

export default router;
