import { validateEmail, validatePasswordStrength } from "./constants";

export const validateSignup = (fields) => {
  const errors = {};
  if (!fields.name) {
    errors.name = "* Name is required.";
  } else if (!fields.name || fields.name.trim().length < 10) {
    errors.name = "Name must be at least 10 characters.";
  } else if (fields.name.trim().length > 60) {
    errors.name = "Name must not exceed 60 characters.";
  }

  const emailError = validateEmail(fields.email);
  if (emailError) errors.email = emailError;

  if (!fields.address || fields.address.trim().length === 0) {
    errors.address = "* Address is required.";
  } else if (fields.address.trim().length > 400) {
    errors.address = "Address must not exceed 400 characters.";
  }

  const passwordError = validatePasswordStrength(fields.password);
  if (passwordError) errors.password = passwordError;

  return errors;
};
