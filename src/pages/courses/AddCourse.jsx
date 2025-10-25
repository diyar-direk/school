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
const apiClient = new APIClient(endPoints.courses);
const AddCourse = () => {
  const context = useContext(Context);
  const formik = useFormik({
    initialValues: {
      name: "",
      code: "",
      description: "",
      teacherId: [],
    },
    validationSchema: courseSchema,
    onSubmit: (values) => handleSubmit.mutate(values),
  });
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationFn: (data) => apiClient.addData(data),
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints.courses]);
      formik.resetForm();
    },
  });

  const language = context?.selectedLang;

  const selectTeachers = useCallback(
    (value) => {
      const prev = formik.values?.teacherId?.map((s) => s?._id);
      if (!prev.includes(value?._id)) {
        const newTeachers = [...(formik?.values?.teacherId || []), value];
        formik.setFieldValue("teacherId", newTeachers);
      }
    },
    [formik]
  );
  const ignoreTeacher = useCallback(
    (value) => {
      const filterd = formik.values?.teacherId?.filter(
        (s) => s?._id !== value?._id
      );
      formik.setFieldValue("teacherId", filterd);
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
            onChange={(e) => selectTeachers(e)}
            value={formik.values.teacherId}
            onIgnore={(e) => ignoreTeacher(e)}
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
        <Button type="submit" isSending={handleSubmit.isPending}>
          {language?.exams?.save_btn}
        </Button>
      </form>
    </div>
  );
};

export default AddCourse;
