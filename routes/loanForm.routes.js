import express from 'express';
import {
  createLoanApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats
} from '../controllers/loanForm.controller.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.get('/stats', getApplicationStats);
router.post(
  "/apply",
  upload.fields([
    { name: "idDocument", maxCount: 1 },
    { name: "businessDocs", maxCount: 5 },
    { name: "bankStatements", maxCount: 5 },
    { name: "ownerIds", maxCount: 5 },
  ]),
  createLoanApplication
);
router.get('/', getAllApplications);
router.get('/:id', getApplicationById);
router.put('/:id/status', updateApplicationStatus);
router.delete('/:id', deleteApplication);

export default router;