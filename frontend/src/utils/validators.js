export const validateEmail = (email) => {
  const regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regEx.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword;
};

export const validateUsername = (username) => {
  return username.length >= 3;
};
