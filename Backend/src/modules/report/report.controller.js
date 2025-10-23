import Report from '../../DB/models/report.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { AppError } from '../../utils/AppError.js';
import { successResponce } from '../../utils/Response.js';

/**
 * @desc Create a new report (Book or User)
 * @route POST /reports
 * @access User
 */
export const createReport = asyncHandler(async (req, res, next) => {
  const { targetType, targetId, reason, description } = req.body;

  if (targetType === 'user' && targetId === req.user._id.toString()) {
    return next(new AppError('You cannot report yourself.', 400));
  }

  const report = await Report.create({
    reporterId: req.user._id,
    targetType,
    targetId,
    reason,
    description,
  });

  return successResponce({
    res,
    status: 201,
    message: 'Report created successfully.',
    data: report,
  });
});

/**
 * @desc Get all reports (Admin only)
 * @route GET /reports
 * @access Admin
 */
export const getAllReports = asyncHandler(async (req, res, next) => {
  const reports = await Report.find()
    .populate('reporterId')
    .populate('targetId')
    .sort({ createdAt: -1 });

  return successResponce({
    res,
    message: 'All reports fetched successfully.',
    data: reports,
  });
});

/**
 * @desc Get reports created by a specific user
 * @route GET /reports/user/:userId
 * @access User/Admin
 */
export const getReportsByUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const reports = await Report.find({ reporterId: userId })
    .populate('reporterId')
    .populate('targetId')
    .sort({ createdAt: -1 });

  if (!reports.length) {
    return next(new AppError('No reports found for this user.', 404));
  }

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

  const reports = await Report.find({ targetType: 'User', targetId: userId })
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
 * @desc Delete a report (Admin only)
 * @route DELETE /reports/:id
 * @access Admin
 */
export const deleteReport = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const report = await Report.findByIdAndDelete(id);
  if (!report) return next(new AppError('Report not found.', 404));

  return successResponce({
    res,
    message: 'Report deleted successfully.',
  });
});
