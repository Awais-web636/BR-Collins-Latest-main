export const REGEX = {
  EMAIL: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  PASSWORD: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,15}$/,
  NAME: /^[a-zA-Z ]+$/,
  OBJECT_ID: /^[0-9a-fA-F]{24}$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
};
