import { isValidObjectId } from "mongoose";

import GenerateError from "../helpers/Error.js";

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  console.log(contactId);
  if (!isValidObjectId(contactId)) {
    return next(GenerateError(404, `${contactId} not valid id`));
  }

  next();
};

export default isValidId;
