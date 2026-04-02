export function errorHandler(err, req, res, _next) {
  console.error('Unhandled error:', err);

  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message;

  res.status(500).json({ error: message });
}
