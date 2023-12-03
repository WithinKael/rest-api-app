import GenerateError from "../helpers/Error.js";

const isEmptyBody = (req, res, next) => {
  if (!Object.keys(req.body).length) {
    return next(GenerateError(400, "Body is empty"));
  }
  next();
};

export default isEmptyBody;
