import * as yup from "yup";
import { roles } from "../constants/enums";
export const usersSchema = yup.object({
  username: yup
    .string()
    .required("username is required")
    .min(3, "user name most be btween 3-50 characters")
    .max(50, "user name most be btween 3-50 characters"),
  password: yup
    .string()
    .required("password is required")
    .min(6, "password must be more than 5 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Passwords must match"),
  role: yup
    .string()
    .required("you have to selecte role")
    .oneOf(Object.values(roles)),
  profileId: yup.object().required("you have to selecte user's profile"),
});
