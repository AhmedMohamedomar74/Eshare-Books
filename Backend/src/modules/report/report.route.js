import express from 'express';
import {
  createReport,
  getAllReports,
  getReportsByUser,
  getReportsAgainstUser,
  updateReportStatus,
  cancelReport,
  deleteReport,
} from './report.controller.js';

import { auth, adminCheckmiddelware } from '../../middelwares/auth.middleware.js';
import { validateReport } from '../../middelwares/validation.middleware.js';

const reportRouter = express.Router();

/**
 * @route POST /api/reports
 * @desc Create a new report (user must be logged in)
 * @access User
 */
reportRouter.post('/', auth, validateReport, createReport);

/**
 * @route GET /api/reports
 * @desc Get all reports (admin only)
 * @access Admin
 */
reportRouter.get('/', auth, adminCheckmiddelware, getAllReports);

/**
 * @route GET /api/reports/user/:userId
 * @desc Get reports created by a specific user
 * @access User/Admin
 */
reportRouter.get('/user/:userId', auth, getReportsByUser);

/**
 * @route GET /api/reports/target/:userId
 * @desc Get reports made against a specific user (admin only)
 * @access Admin
 */
reportRouter.get('/target/:userId', auth, adminCheckmiddelware, getReportsAgainstUser);

/**
 * @route PATCH /api/reports/:id
 * @desc Update report status (admin only)
 * @access Admin
 */
reportRouter.patch('/:id', auth, adminCheckmiddelware, updateReportStatus);

/**
 * @route PATCH /api/reports/:id/cancel
 * @desc Cancel report by user (only if still pending)
 * @access User
 */
reportRouter.patch('/:id/cancel', auth, cancelReport);

/**
 * @route DELETE /api/reports/:id
 * @desc Delete a report (admin only)
 * @access Admin
 */
reportRouter.delete('/:id', auth, adminCheckmiddelware, deleteReport);

export default reportRouter;
