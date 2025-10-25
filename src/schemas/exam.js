import * as yup from "yup";
export const examSchema = yup.object({
  title: yup.string().required("exam title is required"),
  courseId: yup.object().required("You must choose the test material"),
  date: yup.date().required("exam date is required"),
  duration: yup
    .number()
    .required("write exam duration in minutes")
    .min(0, "duration can not be negative value"),
  totalMarks: yup
    .number()
    .required("please write exam total mark")
    .min(0, "total mark can not be negative value"),
});
