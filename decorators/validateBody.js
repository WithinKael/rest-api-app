import GenerateError from "../helpers/Error.js";
const validateBody = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(GenerateError(400, error.message));
    }
    next();
  };
  return func;
};

export default validateBody;
