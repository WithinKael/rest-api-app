import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import "dotenv/config.js";

import GenerateError from "../helpers/Error.js";

import decoratorWrapper from "../decorators/decoratorWrapper.js";

import UserModel from "../models/users.js";

const { JWT_SECRET } = process.env;

const signUp = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    throw GenerateError(409, "Email already used");
  }

  const hashedPass = await bcrypt.hash(password, 10);

  const newUser = await UserModel.create({ ...req.body, password: hashedPass });

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
  });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw GenerateError(401, "Email or password invalid");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw GenerateError(401, "Email or password invalid");
  }

  const { _id: id } = user;
  const payload = {
    id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

  await UserModel.findByIdAndUpdate(id, { token });

  res.json({
    token,
  });
};

const getCurrent = async (req, res) => {
  const { username, email } = req.user;

  res.json({
    username,
    email,
  });
};

const signOut = async (req, res) => {
  const { _id } = req.user;
  await UserModel.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "SignOut success",
  });
};

export default {
  signUp: decoratorWrapper(signUp),
  signIn: decoratorWrapper(signIn),
  getCurrent: decoratorWrapper(getCurrent),
  signOut: decoratorWrapper(signOut),
};
