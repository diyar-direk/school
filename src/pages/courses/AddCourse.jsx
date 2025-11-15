import { useCallback, useContext } from "react";
import { Context } from "../../context/Context";
import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import Button from "../../components/buttons/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
import { courseSchema } from "../../schemas/course";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { courseStatus } from "../../constants/enums";
import axiosInstance from "../../utils/axios";
const apiClient = new APIClient(endPoints.courses);

const AddCourse = () => {
  const context = useContext(Context);
  const formik = useFormik({
    initialValues: {
      name: "",
      code: "",
      description: "",
      teacherId: [],
      students: [],
    },
    validationSchema: courseSchema,
    onSubmit: (values) => handleSubmit.mutate(values),
  });
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationFn: (data) => apiClient.addData(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries([endPoints.courses]);
      addStudentCourse.mutate(data._id);
    },
  });
  const addStudentCourse = useMutation({
    mutationFn: async (courseId) => {
      if (formik.values.students?.length > 0) {
        const docs = formik?.values?.students?.map((e) => ({
          studentId: e._id,
          courseId,
          status: courseStatus.Active,
        }));
        await axiosInstance.patch(
          `${endPoints["student-courses"]}/${endPoints["create-many"]}`,
          { docs }
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints["student-courses"]]);
      formik.resetForm();
    },
  });

  const language = context?.selectedLang;

  const multiSelect = useCallback(
    (value, field) => {
      const prev = formik.values?.[field]?.map((s) => s?._id);
      if (!prev.includes(value?._id)) {
        const newValues = [...(formik?.values?.[field] || []), value];
        formik.setFieldValue(field, newValues);
      }
    },
    [formik]
  );

  const ignoreSelect = useCallback(
    (value, field) => {
      const filterd = formik.values?.[field]?.filter(
        (s) => s?._id !== value?._id
      );
      formik.setFieldValue(field, filterd);
    },
    [formik]
  );

  return (
    <div className="container relative">
      <h1 className="title">add course</h1>

      <form onSubmit={formik.handleSubmit} className="relative dashboard-form">
        <h1>{language.exams && language.exams.please_complete_form}</h1>
        <div className="flex wrap">
          <Input
            title={"language?.course?.name"}
            onInput={formik.handleChange}
            value={formik.values.name}
            placeholder={"language?.course?.name"}
            name="name"
            errorText={formik.errors?.name}
          />
          <Input
            title={"language?.course?.code"}
            onInput={formik.handleChange}
            value={formik.values.code}
            placeholder={"language?.course?.code"}
            name="code"
            errorText={formik.errors?.code}
          />
          <SelectInputApi
            endPoint={endPoints.teachers}
            label="teahcers"
            placeholder="course teachers"
            optionLabel={(e) => `${e.firstName} ${e.lastName}`}
            isArray
            onChange={(e) => multiSelect(e, "teacherId")}
            value={formik.values.teacherId}
            onIgnore={(e) => ignoreSelect(e, "teacherId")}
          />
          <Input
            title={"language?.course?.desc"}
            onInput={formik.handleChange}
            value={formik.values.description}
            placeholder={"language?.course?.desc"}
            name="description"
            errorText={formik.errors?.description}
            elementType="textarea"
            rows={5}
          />
        </div>
        <div className="flex wrap" style={{ marginTop: "10px" }}>
          <SelectInputApi
            endPoint={endPoints.students}
            label="students"
            placeholder="students"
            optionLabel={(e) => `${e.firstName} ${e.lastName}`}
            isArray
            onChange={(e) => multiSelect(e, "students")}
            value={formik.values.students}
            onIgnore={(e) => ignoreSelect(e, "students")}
          />
        </div>
        <Button type="submit" isSending={handleSubmit.isPending}>
          {language?.exams?.save_btn}
        </Button>
      </form>
    </div>
  );
};

export default AddCourse;
