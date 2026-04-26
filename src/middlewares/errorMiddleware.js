const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error(`🚨 Error Occurred: ${err.message}`);

  res.status(statusCode).json({
    message: err.message,
    // Agar development mode hai toh error ka detail bhejo, warna mat bhejo
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };