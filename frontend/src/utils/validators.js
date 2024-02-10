// Desc: Validators for user input
export const validateEmail = (email) => {
  const regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regEx.test(email);
};

// Desc: Validators for user input
export const validatePassword = (password) => {
  return password.length >= 6;
};

// Desc: Validators for user input
export const validateConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword;
};

// Desc: Validators for user input
export const validateUsername = (username) => {
  return username.length >= 3;
};
