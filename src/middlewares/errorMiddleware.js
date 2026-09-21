const errorHandler = (err, req, res, next) => {
  console.error('Error no controlado:', err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Error interno del servidor',
  });
};

module.exports = errorHandler;