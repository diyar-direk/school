import { useContext } from "react";
import { Context } from "../../context/Context";
import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import Button from "../../components/buttons/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "./../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
import { genders } from "../../constants/enums";
import { useNavigate } from "react-router-dom";
import { studentSchema } from "./../../schemas/student";
import dateFormatter from "./../../utils/dateFormatter";

const apiClient = new APIClient(endPoints.students);

const AddStudent = () => {
  const context = useContext(Context);
  const nav = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      phone: "",
      email: "",
      gender: "",
      address: "",
      enrollmentDate: dateFormatter(new Date()),
      guardianName: "",
      guardianPhone: "",
      guardianRelationship: "",
    },
    validationSchema: studentSchema,
    onSubmit: (values) => handleSubmit.mutate(values),
  });
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationFn: (data) => apiClient.addData(data),
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints.students]);
      nav(-1);
    },
  });

  const language = context?.selectedLang;

  return (
    <div className="container relative">
      <h1 className="title">
        {language.students && language.students.add_student_btn}
      </h1>
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
            title={"language?.teachers?.birth_date"}
            onInput={formik.handleChange}
            value={formik.values.dateOfBirth}
            name="dateOfBirth"
            type="date"
            errorText={formik.errors?.dateOfBirth}
          />

          <Input
            title={language?.teachers?.phone_number}
            onInput={formik.handleChange}
            value={formik.values?.phone}
            placeholder={language?.teachers?.phone_number_placeholder}
            name="phone"
            errorText={formik.errors?.phone}
          />
          <Input
            title={language?.teachers?.email}
            onInput={formik.handleChange}
            value={formik.values.email}
            placeholder={language?.teachers?.email_placeholder}
            name="email"
            errorText={formik.errors?.email}
          />
          <Input
            title={"language?.teachers?.address"}
            onInput={formik.handleChange}
            value={formik.values.address}
            placeholder={"language?.teachers?.address_placeholder"}
            name="address"
            errorText={formik.errors?.address}
          />
          <Input
            title={"language?.teachers?.birth_date"}
            onInput={formik.handleChange}
            value={formik.values.enrollmentDate}
            name="enrollmentDate"
            type="date"
            errorText={formik.errors?.enrollmentDate}
          />
          <Input
            title={"language?.teachers?.guardianName"}
            onInput={formik.handleChange}
            value={formik.values.guardianName}
            placeholder={"language?.teachers?.guardianName_placeholder"}
            name="guardianName"
            errorText={formik.errors?.guardianName}
          />
          <Input
            title={"language?.teachers?.guardianPhone"}
            onInput={formik.handleChange}
            value={formik.values.guardianPhone}
            placeholder={"language?.teachers?.guardianPhone_placeholder"}
            name="guardianPhone"
            errorText={formik.errors?.guardianPhone}
          />
          <Input
            title={"language?.teachers?.guardianRelationship"}
            onInput={formik.handleChange}
            value={formik.values.guardianRelationship}
            placeholder={"language?.teachers?.guardianRelationship_placeholder"}
            name="guardianRelationship"
            errorText={formik.errors?.guardianRelationship}
          />
        </div>
        <Button type="submit" isSending={handleSubmit.isPending}>
          {language?.exams?.save_btn}
        </Button>
      </form>
    </div>
  );
};

export default AddStudent;
