import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import "dotenv/config.js";
import GenerateError from "../helpers/Error.js";
import decoratorWrapper from "../decorators/decoratorWrapper.js";
import UserModel from "../models/users.js";
import sendEmail from "../helpers/SendEmail.js";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";

const { JWT_SECRET, BASE_URL } = process.env;

const avatarsPath = path.resolve("public", "avatars");

const signUp = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    throw GenerateError(409, "Email already used");
  }

  const hashedPass = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationCode = nanoid();

  const newUser = await UserModel.create({
    ...req.body,
    password: hashedPass,
    verificationCode,
    avatarURL,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
  });
};

const verify = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await UserModel.findOne({ verificationCode });

  if (!user) {
    throw GenerateError(409, "Email invalid or already verified");
  }

  await UserModel.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: "",
  });

  res.json({
    message: "Email verified",
  });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw GenerateError(400, "Email not defined");
  }
  if (user.verify) {
    throw GenerateError(400, "Email already verified");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationCode}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Email send success",
  });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw GenerateError(401, "Email or password invalid");
  }

  if (!user.verify) {
    throw GenerateError(401, "Email not verify");
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
    user,
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

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const resultUpload = path.join(avatarsPath, filename);
  (await Jimp.read(oldPath)).resize(250, 250).write(resultUpload);
  await fs.unlink(oldPath);
  const avatarURL = path.join("avatars", filename);
  await UserModel.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

export default {
  signUp: decoratorWrapper(signUp),
  verify: decoratorWrapper(verify),
  resendVerify: decoratorWrapper(resendVerify),
  signIn: decoratorWrapper(signIn),
  getCurrent: decoratorWrapper(getCurrent),
  signOut: decoratorWrapper(signOut),
  updateAvatar: decoratorWrapper(updateAvatar),
};
