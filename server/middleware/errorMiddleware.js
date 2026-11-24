const errorMiddleware = (err, req, res, next) => {
  console.error(err)

  if (res.headersSent) {
    return next(err)
  }

  const statusCode = err.code || err.statusCode || 500

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
  })
}

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  error.code = 404
  next(error)
}

module.exports = { notFound, errorHandler: errorMiddleware }