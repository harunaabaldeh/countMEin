import * as yup from "yup";

export const loginFormSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required(),
});

//signup
export const signupFormSchema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().required().email(),
  password: yup.string().required(),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password"), ""], "Passwords must match"),
});

