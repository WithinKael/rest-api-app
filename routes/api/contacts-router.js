import express from "express";
import contactsController from "../../controllers/contacts-controller.js";
import isEmptyBody from "../../middleware/isEmptyBody.js";
import isValidId from "../../middleware/isValidId.js";
import validateBody from "../../decorators/validateBody.js";
import {
  addContactValidSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../../models/contacts.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getAllContacts);

contactsRouter.get("/:contactId", isValidId, contactsController.getById);

contactsRouter.post(
  "/",
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
