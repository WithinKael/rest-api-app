import jwt from "jsonwebtoken";

import "dotenv/config.js";

import GenerateError from "../helpers/Error.js";

import decoratorWrapper from "../decorators/decoratorWrapper.js";

import UserModel from "../models/users.js";

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw GenerateError(401, "Authorization header undefined");
  }

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    throw GenerateError(401);
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(id);

    if (!user || !user.token) {
      throw GenerateError(401, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw GenerateError(401, error.message);
  }
};

export default decoratorWrapper(authenticate);
