import Report from '../../DB/models/report.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { AppError } from '../../utils/AppError.js';
import { successResponce } from '../../utils/Response.js';
import { findManyNonDeleted, restoreSoftDelete, softDelete } from '../../DB/db.services.js';

/**
 * @desc Create a new report (Book or User)
 * @route POST /reports
 * @access User
 */
export const createReport = asyncHandler(async (req, res, next) => {
  const { targetType, targetId, reason, description } = req.body;
  const reporterId = req.user._id;

  if (targetType === 'user' && targetId === reporterId.toString()) {
    return next(new AppError('You cannot report yourself.', 403));
  }

  const duplicateReport = await Report.findOne({
    reporterId,
    targetType,
    targetId,
    reason,
    description: description || '',
    status: { $ne: 'Cancelled' },
  });

  if (duplicateReport) {
    return next(new AppError('You have already submitted this exact report.', 400));
  }

  const report = await Report.create({
    reporterId,
    targetType,
    targetId,
    reason,
    description: description || '',
  });

  return successResponce({
    res,
    status: 201,
    message: 'Report created successfully.',
    data: report,
  });
});

/**
 * @desc Get all my reports
 * @route GET /reports/my
 * @access User
 */
export const getMyReports = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const reports = await findManyNonDeleted({
    model: Report,
    filter: { reporterId: userId },
    sort: { createdAt: -1 },
  });

  if (!reports.length) {
    return next(new AppError('No reports found.', 404));
  }

  for (let report of reports) {
    if (report.targetType === 'user') {
      await report.populate({ path: 'targetId', select: 'firstName secondName', model: 'user' });
    } else if (report.targetType === 'Book') {
      await report.populate({ path: 'targetId', select: 'Title', model: 'Book' });
    }
  }

  return successResponce({
    res,
    message: 'Your reports fetched successfully.',
    data: reports,
  });
});

/**
 * @desc Get all reports (Admin only)
 * @route GET /reports
 * @access Admin
 */
export const getAllReports = asyncHandler(async (req, res, next) => {
  const reports = await findManyNonDeleted({
    model: Report,
    filter: { status: { $ne: 'Cancelled' } },
    sort: { createdAt: -1 },
  });

  if (!reports.length) return next(new AppError('No reports found.', 404));

  for (let report of reports) {
    // Populate reporter data
    await report.populate({
      path: 'reporterId',
      select: 'firstName secondName fullName',
      model: 'user',
    });

    // Populate target data
    if (report.targetType === 'user') {
      await report.populate({
        path: 'targetId',
        select: 'firstName secondName fullName',
        model: 'user',
      });
    } else if (report.targetType === 'Book') {
      await report.populate({
        path: 'targetId',
        select: 'Title',
        model: 'Book',
      });
    }
  }

  return successResponce({
    res,
    message: 'Reports fetched successfully.',
    data: reports,
  });
});

/**
 * @desc Get reports created by a specific user
 * @route GET /reports/user/:userId
 * @access Admin
 */
export const getReportsByUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const reports = await findManyNonDeleted({
    model: Report,
    filter: {
      reporterId: userId,
      status: { $ne: 'Cancelled' },
    },
    sort: { createdAt: -1 },
  });

  if (!reports.length) {
    return next(new AppError('No reports found for this user.', 404));
  }

  await populateReports(reports);

  return successResponce({
    res,
    message: 'Reports fetched successfully.',
    data: reports,
  });
});

/**
 * @desc Get reports made against a specific user
 * @route GET /reports/target/:userId
 * @access Admin
 */
export const getReportsAgainstUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const reports = await Report.find({ targetType: 'user', targetId: userId })
    .populate('reporterId')
    .populate('targetId')
    .sort({ createdAt: -1 });

  if (!reports.length) {
    return next(new AppError('No reports found against this user.', 404));
  }

  return successResponce({
    res,
    message: 'Reports against user fetched successfully.',
    data: reports,
  });
});

/**
 * @desc Update report status (Admin only)
 * @route PATCH /reports/:id
 * @access Admin
 */
export const updateReportStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const { id } = req.params;

  const allowedStatuses = ['Pending', 'Reviewed', 'Dismissed'];
  if (!allowedStatuses.includes(status)) {
    return next(new AppError('Invalid status value.', 400));
  }

  const report = await Report.findByIdAndUpdate(id, { status }, { new: true })
    .populate('reporterId')
    .populate('targetId');

  if (!report) return next(new AppError('Report not found.', 404));

  return successResponce({
    res,
    message: 'Report status updated successfully.',
    data: report,
  });
});

/**
 * @desc Cancel report by user (if still pending)
 * @route PATCH /reports/:id/cancel
 * @access User (report owner only)
 */
export const cancelReport = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const report = await Report.findById(id).populate('reporterId').populate('targetId');

  if (!report) return next(new AppError('Report not found.', 404));

  if (report.reporterId._id.toString() !== req.user._id.toString()) {
    return next(new AppError('You can only cancel your own reports.', 403));
  }

  if (report.status !== 'Pending') {
    return next(new AppError('Only pending reports can be cancelled.', 400));
  }

  report.status = 'Cancelled';
  await report.save();

  return successResponce({
    res,
    message: 'Report cancelled successfully.',
    data: report,
  });
});

/**
 * @desc Soft delete a report (Admin only)
 * @route DELETE /reports/:id
 * @access Admin
 */
export const deleteReport = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedReport = await softDelete({
    model: Report,
    filter: { _id: id },
  });

  if (!deletedReport) {
    return next(new AppError('Report not found or already deleted.', 404));
  }

  return successResponce({
    res,
    message: 'Report soft deleted successfully.',
    data: deletedReport,
  });
});

/**
 * @desc Restore a soft deleted report (Admin only)
 * @route PATCH /reports/restore/:id
 * @access Admin
 */
export const restoreReport = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const restoredReport = await restoreSoftDelete({
    model: Report,
    filter: { _id: id },
  });

  if (!restoredReport) {
    return next(new AppError('Report not found or already active.', 404));
  }

  return successResponce({
    res,
    message: 'Report restored successfully.',
    data: restoredReport,
  });
});
