import express from "express";
import contactsController from "../../controllers/contacts-controller.js";
import isEmptyBody from "../../middleware/isEmptyBody.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getAllContacts);

contactsRouter.get("/:contactId", contactsController.getById);

contactsRouter.post("/", isEmptyBody, contactsController.postOneContact);

contactsRouter.put("/:contactId", isEmptyBody, contactsController.putById);

contactsRouter.delete("/:contactId", contactsController.deleteById);

export default contactsRouter;
