import { validateEmail } from "./constants.js";

export const validateCreateStore = (fields) => {
  const errors = {};

  if (!fields.name || fields.name.trim().length === 0) {
    errors.name = "* Store name is required.";
  }

  const emailError = validateEmail(fields.email);
  if (emailError) errors.email = emailError;

  if (!fields.address || fields.address.trim().length === 0) {
    errors.address = "* Address is required.";
  }

  if (!fields.ownerId) {
    errors.ownerId = "Please select a Store Owner.";
  }

  return errors;
};
