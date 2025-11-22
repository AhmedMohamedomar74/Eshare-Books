export const glopalErrorHandling = (error, req, res, next) => {
  const statusCode = error.statusCode || error.cause || 500;
  const message = error.message || 'Something went wrong';

  res.status(statusCode).json({
    status: statusCode >= 400 && statusCode < 500 ? 'fail' : 'error',
    message: message,
    // stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
};
