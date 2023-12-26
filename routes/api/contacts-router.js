import express from "express";
import contactsController from "../../controllers/contacts-controller.js";
import isEmptyBody from "../../middleware/isEmptyBody.js";
import isValidId from "../../middleware/isValidId.js";
import authenticate from "../../middleware/authenticate.js";
import validateBody from "../../decorators/validateBody.js";
import {
  addContactValidSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../../models/contacts.js";
import upload from "../../middleware/upload.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsController.getAllContacts);

contactsRouter.get("/:contactId", isValidId, contactsController.getById);

contactsRouter.post(
  "/",
  upload.single("avatar"),
  isEmptyBody,
  validateBody(addContactValidSchema),
  contactsController.postOneContact
);

contactsRouter.put(
  "/:contactId",
  isValidId,
  isEmptyBody,
  validateBody(updateContactSchema),
  contactsController.putById
);

contactsRouter.patch(
  "/:contactId/favorite",
  isValidId,
  isEmptyBody,
  validateBody(updateFavoriteSchema),
  contactsController.putById
);

contactsRouter.delete("/:contactId", isValidId, contactsController.deleteById);

export default contactsRouter;
