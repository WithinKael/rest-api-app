import GenerateError from "../helpers/Error.js";
import decoratorWrapper from "../decorators/decoratorWrapper.js";
import ContactModel from "../models/contacts.js";

const getAllContacts = async (req, res) => {
  const result = await ContactModel.find({}, "-createdAt -updatedAt");
  res.status(200).json(result);
};

const getById = async (req, res) => {
  const result = await ContactModel.findById(req.params.contactId);

  if (!result) {
    throw GenerateError(404, "Not Found");
  }

  res.status(200).json(result);
};

const postOneContact = async (req, res) => {
  const result = await ContactModel.create(req.body);
  res.status(201).json(result);
};

const putById = async (req, res) => {
  const { contactId } = req.params;
  const result = await ContactModel.findByIdAndUpdate(contactId, req.body);
  if (!result) {
    throw GenerateError(404, "Not found");
  }

  res.status(200).json(result);
};

const deleteById = async (req, res) => {
  const result = await ContactModel.findByIdAndDelete(req.params.contactId);
  if (!result) {
    throw GenerateError(404, "Not found");
  }

  res.status(200).json({ message: "Contact deleted" });
};

export default {
  getAllContacts: decoratorWrapper(getAllContacts),
  getById: decoratorWrapper(getById),
  postOneContact: decoratorWrapper(postOneContact),
  putById: decoratorWrapper(putById),
  deleteById: decoratorWrapper(deleteById),
};
