const errorHandler = (err, req, res, next) => {
  // Only log full errors in development or if it's a 500
  if (process.env.NODE_ENV !== 'production' || !err.status || err.status === 500) {
    console.error(err.stack);
  }

  let statusCode = err.status || 500;
  let message = err.message || 'Internal Server Error';
  let errorCode = 'SERVER_ERROR';

  if (err.code === 11000) {
    statusCode = 409;
    message = 'Resource already exists or duplicate field value entered';
    errorCode = 'CONFLICT';
  }

  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = Object.values(err.errors).map(val => val.message).join(', ');
    errorCode = 'VALIDATION_ERROR';
  }
  
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource ID format';
    errorCode = 'INVALID_ID';
  }

  // Prevent leaking detailed internal error messages in production for 500 errors
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal Server Error';
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorCode,
  });
};

export default errorHandler;
