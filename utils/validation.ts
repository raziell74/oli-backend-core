// utils/validation.ts

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[\w-]+(\+[\w-]+)*(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return emailRegex.test(email);
};
