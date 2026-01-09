import express from 'express';
import {
  createLoanApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats
} from '../controllers/loanForm.controller.js';

const router = express.Router();

// GET /api/loan-forms/stats - Get application statistics
router.get('/stats', getApplicationStats);

// POST /api/loan-forms - Create new loan application
router.post('/', createLoanApplication);

// GET /api/loan-forms - Get all loan applications
router.get('/', getAllApplications);

// GET /api/loan-forms/:id - Get single application by ID
router.get('/:id', getApplicationById);

// PUT /api/loan-forms/:id/status - Update application status
router.put('/:id/status', updateApplicationStatus);

// DELETE /api/loan-forms/:id - Delete application
router.delete('/:id', deleteApplication);

export default router;