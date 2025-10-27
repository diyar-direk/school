import * as yup from "yup";
export const courseSchema = yup.object({
  name: yup.string().required("course name is required"),
  code: yup.string().required("course code is required"),
  description: yup.string().notRequired(),
  teacherId: yup.array(),
});
