import { useContext } from "react";
import { Context } from "../../context/Context";
import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import Button from "../../components/buttons/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import APIClient from "./../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
import { teacherSchema } from "./../../schemas/teacher";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
import { genders } from "../../constants/enums";
import { useParams } from "react-router-dom";
import Skeleton from "../../components/skeleton/Skeleton";

const apiClient = new APIClient(endPoints.teachers);
const UpdateTeacher = () => {
  const context = useContext(Context);
  const { id } = useParams();
  const { data,isLoading } = useQuery({
    queryKey: [endPoints.teachers, id],
    queryFn: () => apiClient.getOne(id),
  });
  const formik = useFormik({
    initialValues: {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      middleName: data?.middleName || "",
      email: data?.email || "",
      gender: data?.gender || "",
      phoneNumber: data?.phoneNumber || "",
    },
    validationSchema: teacherSchema,
    onSubmit: (values) => handleSubmit.mutate(values),
    enableReinitialize: true,
  });
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationFn: (data) => apiClient.updateData({ data, id }),
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints.teachers]);
      formik.resetForm();
    },
  });

  const language = context?.selectedLang;

  if (isLoading)
    return (
      <div className="container">
        <Skeleton height="200px" />
      </div>
    );

  return (
    <div className="container relative">
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
            title={"language?.teachers?.phone"}
            onInput={formik.handleChange}
            value={formik.values.phoneNumber}
            placeholder={"language?.teachers?.phoneNumber_placeholder"}
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

export default UpdateTeacher;
