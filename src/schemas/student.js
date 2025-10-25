import * as yup from "yup";
import { genders } from "../constants/enums";
export const studentSchema = yup.object({
  firstName: yup.string().required("first name is required"),
  middleName: yup.string().required("middle name is required"),
  lastName: yup.string().required("last name is required"),
  dateOfBirth: yup.date().required("date of birth is required"),
  phone: yup.string().notRequired(),
  email: yup.string().email("plesae enter valid email").notRequired(),
  gender: yup
    .string()
    .required("gender is requierd")
    .oneOf(Object.values(genders)),
  address: yup.string().notRequired(),
  enrollmentDate: yup.date().notRequired(),
  guardianName: yup.string().notRequired(),
  guardianPhone: yup.string().notRequired(),
  guardianRelationship: yup.string().notRequired(),
});
