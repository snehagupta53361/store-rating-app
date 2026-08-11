import { validateEmail } from "./constants";

export const validateLogin = (fields) => {
  const errors = {};

  const emailError = validateEmail(fields.email);
  if (emailError) errors.email = emailError;

  if (!fields.password) {
    errors.password = "* Password is required.";
  }

  return errors;
};
