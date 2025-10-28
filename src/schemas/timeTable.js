import * as yup from "yup";
import { dayes } from "../constants/enums";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const timeTableSchema = yup.object({
  classId: yup.object().required("class is required"),
  courseId: yup.object().required("course is required"),
  dayOfWeek: yup
    .string()
    .required("day is required")
    .oneOf(Object.values(dayes)),
  startTime: yup
    .string()
    .required("please select course start time")
    .matches(timeRegex, "invalid time format, use HH:mm"),
});
