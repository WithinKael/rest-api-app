import contactsService from "../models/contacts.js";
import GenerateError from "../helpers/Error.js";
import {
  addContactValidSchema,
  updateContactSchema,
} from "../schemas/contact-schema.js";

const getAllContacts = async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const result = await contactsService.getContactById(req.params.contactId);

    if (!result) {
      throw GenerateError(404, "Not Found");
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const postOneContact = async (req, res, next) => {
  try {
    const { error } = addContactValidSchema.valid(req.body);
    if (error) {
      throw GenerateError(400, error.message);
    }
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const putById = async (req, res, next) => {
  try {
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw GenerateError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await contactsService.updateContact(contactId, req.body);
    if (!result) {
      throw GenerateError(404, "Not found");
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const result = await contactsService.removeContact(req.params.contactId);
    if (!result) {
      throw GenerateError(404, "Not found");
    }

    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllContacts,
  getById,
  postOneContact,
  putById,
  deleteById,
};
