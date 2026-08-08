export function notFound(req, res, next) {
  const error = new Error(
    `Route not found: ${req.method} ${req.originalUrl}`
  );

  res.status(404);
  next(error);
}

export function errorHandler(error, req, res, next) {
  console.error('SERVER ERROR:', error);

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message:
        'The selected image exceeds the 100 MB upload limit.',
    });
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(413).json({
      success: false,
      message:
        'Too many images were selected for one upload.',
    });
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message:
        'An unexpected image field was submitted. Check the upload field name.',
    });
  }

  if (
    error.message === 'Only image files can be uploaded.'
  ) {
    return res.status(415).json({
      success: false,
      message:
        'Only valid image files can be uploaded.',
    });
  }

  if (
    error.message?.includes(
      'could not be reduced below the Cloudinary upload limit'
    )
  ) {
    return res.status(413).json({
      success: false,
      message:
        'The image could not be optimized enough for upload. Please use an image with smaller dimensions.',
    });
  }

  if (
    error.http_code === 400 ||
    error.name === 'BadRequestError'
  ) {
    return res.status(400).json({
      success: false,
      message:
        error.message || 'Cloudinary rejected the uploaded image.',
    });
  }

  if (
    error.code === '23505'
  ) {
    return res.status(409).json({
      success: false,
      message:
        'A record with the same unique information already exists.',
    });
  }

  if (
    error.code === '23503'
  ) {
    return res.status(400).json({
      success: false,
      message:
        'This operation references a record that does not exist.',
    });
  }

  const statusCode =
    res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : error.status || error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message:
      error.message || 'An unexpected server error occurred.',
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
    }),
  });
}