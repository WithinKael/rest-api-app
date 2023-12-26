import express from "express";

import isEmptyBody from "../../middleware/isEmptyBody.js";

import validateBody from "../../decorators/validateBody.js";

import authController from "../../controllers/auth-controller.js";

import authenticate from "../../middleware/authenticate.js";

import { userSignUpSchema, userSignInSchema } from "../../models/users.js";

import upload from "../../middleware/upload.js";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  isEmptyBody,
  validateBody(userSignUpSchema),
  authController.signUp
);

authRouter.post(
  "/signin",
  isEmptyBody,
  validateBody(userSignInSchema),
  authController.signIn
);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/signout", authenticate, authController.signOut);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authController.updateAvatar
);

export default authRouter;
