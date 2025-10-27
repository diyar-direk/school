import * as yup from "yup";
import { courseStatus } from "../constants/enums";
export const studentCourseSchema = yup.object({
  studentId: yup.object().required("you must choose a student"),
  courseId: yup.object().required("you must choose a course"),
  status: yup
    .string()
    .required("please choose a course status")
    .oneOf(Object.values(courseStatus)),
});
