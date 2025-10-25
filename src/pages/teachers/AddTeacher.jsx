import { useContext } from "react";
import { Context } from "../../context/Context";
import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import Button from "../../components/buttons/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "./../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
import { teacherSchema } from "./../../schemas/teacher";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
import { genders } from "../../constants/enums";
import { useNavigate } from "react-router-dom";

const apiClient = new APIClient(endPoints.teachers);
const AddTeacher = () => {
  const context = useContext(Context);
  const nav = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      gender: "",
      phoneNumber: "",
    },
    validationSchema: teacherSchema,
    onSubmit: (values) => handleSubmit.mutate(values),
  });
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationFn: (data) => apiClient.addData(data),
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints.teachers]);
      nav(-1);
    },
  });

  const language = context?.selectedLang;

  return (
    <div className="container relative">
      <h1 className="title">{language?.teachers?.add_teachers}</h1>

      <form onSubmit={formik.handleSubmit} className="relative dashboard-form">
        <h1>{language.exams && language.exams.please_complete_form}</h1>
        <div className="flex wrap">
          <Input
            title={language?.teachers?.first_name}
            onInput={formik.handleChange}
            value={formik.values.firstName}
            placeholder={language?.teachers?.first_name_placeholder}
            name="firstName"
            errorText={formik.errors?.firstName}
          />
          <Input
            title={language?.teachers?.middle_name}
            onInput={formik.handleChange}
            value={formik.values.middleName}
            placeholder={language?.teachers?.middle_name_placeholder}
            name="middleName"
            errorText={formik.errors?.middleName}
          />
          <Input
            title={language?.teachers?.last_name}
            onInput={formik.handleChange}
            value={formik.values.lastName}
            placeholder={language?.teachers?.last_name_placeholder}
            name="lastName"
            errorText={formik.errors?.lastName}
          />

          <SelectOptionInput
            placeholder={
              formik.values?.gender || language?.teachers?.gender_placeholder
            }
            label="gender"
            options={[
              { text: "male", value: genders.male },
              { text: "female", value: genders.female },
            ]}
            onSelectOption={(opt) => formik.setFieldValue("gender", opt.value)}
            errorText={formik?.errors?.gender}
          />
          <Input
            title={language?.teachers?.phone_number}
            onInput={formik.handleChange}
            value={formik.values.phoneNumber}
            placeholder={language?.teachers?.phone_number_placeholder}
            name="phoneNumber"
            errorText={formik.errors?.phoneNumber}
          />
          <Input
            title={language?.teachers?.email}
            onInput={formik.handleChange}
            value={formik.values.email}
            placeholder={language?.teachers?.email_placeholder}
            name="email"
            errorText={formik.errors?.email}
          />
        </div>
        <Button type="submit" isSending={handleSubmit.isPending}>
          {language?.exams?.save_btn}
        </Button>
      </form>
    </div>
  );
};

export default AddTeacher;
