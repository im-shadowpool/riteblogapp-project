//Unsuppored 404 Routes
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

//Middleware to error Handlers

const errorHandlers = (error, req, res, next) => {
  if (res.headerSent) {
    //response is already sent
    return next(error);
  }

  res
    .status(error.code || 500)
    .json({ message: error.message || "An Unknown Error Occured" });
};

module.exports = { notFound, errorHandlers };
