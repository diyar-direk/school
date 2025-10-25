import * as yup from "yup";
import { genders } from "../constants/enums";
export const teacherSchema = yup.object({
  firstName: yup.string().required("first name is requierd"),
  middleName: yup.string().required("middle name is requierd"),
  lastName: yup.string().required("last name is requierd"),
  email: yup
    .string()
    .required("middle name is requierd")
    .email("please enter valid email"),
  gender: yup
    .string()
    .required("gender is requierd")
    .oneOf(Object.values(genders)),
  phoneNumber: yup.string().notRequired(),
});
