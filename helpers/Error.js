const errorList = {
  400: "Bad Request",
  401: "Unauthrized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
};

const GenerateError = (status, message = errorList[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export default GenerateError;
