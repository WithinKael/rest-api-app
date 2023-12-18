import GenerateError from "../helpers/Error.js";
import decoratorWrapper from "../decorators/decoratorWrapper.js";
import ContactModel from "../models/contacts.js";

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const result = await ContactModel.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  });

  const total = await ContactModel.countDocuments({ owner });
  res.json({ result, total });
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await ContactModel.findOne({ _id: contactId, owner });

  if (!result) {
    throw GenerateError(404, "Not Found");
  }

  res.json(result);
};

const postOneContact = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await ContactModel.create({ ...req.body, owner });
  res.status(201).json(result);
};

const putById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;

  const result = await ContactModel.findOneAndUpdate(
    { _id: contactId, owner },
    req.body
  );
  if (!result) {
    throw GenerateError(404, "Not found");
  }

  res.json(result);
};

const deleteById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;

  const result = await ContactModel.findOneAndDelete({ _id: contactId, owner });
  if (!result) {
    throw GenerateError(404, "Not found");
  }

  res.json({ message: "Contact deleted" });
};

export default {
  getAllContacts: decoratorWrapper(getAllContacts),
  getById: decoratorWrapper(getById),
  postOneContact: decoratorWrapper(postOneContact),
  putById: decoratorWrapper(putById),
  deleteById: decoratorWrapper(deleteById),
};
