/**
 * Validation helpers
 *
 * Small utility predicates used across controllers and services to validate
 * common fields such as email and password strength.
 */

/**
 * Check whether a string is a valid email address.
 *
 * @function isValidEmail
 * @param {string} email - Candidate email address.
 * @returns {boolean} True when the email matches a simple RFC-like pattern.
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Check whether a password meets the project's strength requirements.
 *
 * Requirements (current): at least 8 characters, one lowercase, one uppercase,
 * and one special character.
 *
 * @function isValidPassword
 * @param {string} password - Candidate password.
 * @returns {boolean} True when the password matches the required pattern.
 */
export const isValidPassword = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
  return regex.test(password);
};
