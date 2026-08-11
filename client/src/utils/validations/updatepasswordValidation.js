import { validatePasswordStrength } from "./constants";

export const validateUpdatePassword = (fields) => {
  const errors = {};

  if (!fields.currentPw) {
    errors.currentPw = "Current password is required.";
  }

  const passwordError = validatePasswordStrength(fields.newPw);
  if (passwordError) {
    errors.newPw = passwordError;
  } else if (fields.currentPw && fields.newPw === fields.currentPw) {
    errors.newPw = "New password must be different from the current password.";
  }

  if (!fields.confirmPw) {
    errors.confirmPw = "Please confirm your new password.";
  } else if (fields.newPw && fields.confirmPw !== fields.newPw) {
    errors.confirmPw = "Passwords do not match.";
  }

  return errors;
};
