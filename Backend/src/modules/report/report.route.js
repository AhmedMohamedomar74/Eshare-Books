import express from 'express';
import {
  createReport,
  getAllReports,
  getReportsByUser,
  getReportsAgainstUser,
  updateReportStatus,
  cancelReport,
  deleteReport,
  restoreReport,
} from './report.controller.js';

import { auth, adminCheckmiddelware } from '../../middelwares/auth.middleware.js';
import { validateReport } from '../../middelwares/validation.middleware.js';

const reportRouter = express.Router();

// Create a new report
reportRouter.post('/', auth, validateReport, createReport);

// Get all reports (Admin)
reportRouter.get('/', auth, adminCheckmiddelware, getAllReports);

// Get reports created by a specific user
reportRouter.get('/user/:userId', auth, getReportsByUser);

// Get reports made against a specific user (Admin)
reportRouter.get('/target/:userId', auth, adminCheckmiddelware, getReportsAgainstUser);

// Update report status (Admin)
reportRouter.patch('/:id', auth, adminCheckmiddelware, updateReportStatus);

// Cancel report by user (only if still pending)
reportRouter.patch('/:id/cancel', auth, cancelReport);

// Restore soft deleted report (Admin)
reportRouter.patch('/restore/:id', auth, adminCheckmiddelware, restoreReport);

// Soft delete report (Admin)
reportRouter.delete('/:id', auth, adminCheckmiddelware, deleteReport);

export default reportRouter;
