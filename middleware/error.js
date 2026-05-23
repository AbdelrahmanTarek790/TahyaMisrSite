const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'العنصر المطلوبة غير موجود أو المعرف غير صحيح.';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  else if (err.code === 11000) {
    const message = 'هذه البيانات مسجلة بالفعل في النظام ولا يمكن تكرارها.';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  else if (err.name === 'ValidationError') {
    const message = 'البيانات المرسلة غير صالحة، برجاء التحقق من الحقول المكتوبة.';
    error = { message, statusCode: 400 };
  }

  const statusCode = error.statusCode || 500;
  let responseMessage = error.message;
  if (statusCode === 500) {
    responseMessage = 'حدث خطأ داخلي في الخادم، برجاء المحاولة مرة أخرى لاحقاً.';
  }

  res.status(statusCode).json({
    success: false,
    error: responseMessage || 'حدث خطأ داخلي في الخادم، برجاء المحاولة مرة أخرى لاحقاً.',
    data: null
  });
};

module.exports = errorHandler;