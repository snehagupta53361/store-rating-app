export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
export const PASSWORD_SPECIAL_REGEX = /[!@#$%^&*]/;

export const validateEmail = (email) => {
  if (!email) {
    return "* Email is required.";
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    return "Please enter a valid email address.";
  }
  return null;
};

export const validatePasswordStrength = (password) => {
  if (!password) return "* Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (password.length > 16) return "Password must not exceed 16 characters.";
  if (!PASSWORD_UPPERCASE_REGEX.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!PASSWORD_SPECIAL_REGEX.test(password)) {
    return "Password must contain at least one special character (!@#$%^&*).";
  }
  return null;
};
