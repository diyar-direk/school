import { useCallback, useContext } from "react";
import { Context } from "../../context/Context";
import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import Button from "../../components/buttons/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "./../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
import { usersSchema } from "../../schemas/user";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
import { roles } from "../../constants/enums";
import SelectInputApi from "./../../components/inputs/SelectInputApi";
import { formatInputsData } from "../../utils/formatInputsData";
const apiClient = new APIClient(endPoints.users);
const AddUser = () => {
  const context = useContext(Context);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
      role: "",
      profileId: "",
    },
    validationSchema: usersSchema,
    onSubmit: (values) => handleSubmit.mutate(formatInputsData(values)),
  });
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationFn: (data) => apiClient.addData(data),
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints.users]);
      formik.resetForm();
    },
  });

  const language = context?.selectedLang;

  const selectRole = useCallback(
    (newRole) => {
      if (newRole !== formik?.values?.role) {
        formik.setValues({ ...formik.values, role: newRole, profileId: null });
      }
    },
    [formik]
  );

  return (
    <div className="container relative">
      <h1 className="title">{language.users && language.users.add_users}</h1>

      <form onSubmit={formik.handleSubmit} className="relative dashboard-form">
        <h1>{language.exams && language.exams.please_complete_form}</h1>
        <div className="flex wrap ">
          <Input
            title={language?.users?.user_name}
            onInput={formik.handleChange}
            value={formik.values.username}
            placeholder={language?.users?.user_name_placeholder}
            name="username"
            errorText={formik.errors?.username}
          />
          <Input
            title={language?.users?.password}
            onInput={formik.handleChange}
            value={formik.values.password}
            placeholder={language?.users?.password_placeholder}
            name="password"
            errorText={formik.errors?.password}
            type="password"
          />
          <Input
            title={"language?.users?.passwordConf"}
            onInput={formik.handleChange}
            value={formik.values.confirmPassword}
            placeholder={"language?.users?.password_placeholderConf"}
            name="confirmPassword"
            errorText={formik.errors?.confirmPassword}
            type="password"
          />
          <SelectOptionInput
            placeholder={formik.values?.role || "select role"}
            label={language?.users?.role}
            options={[
              { text: "admin", value: roles.admin },
              { text: "teacher", value: roles.teacher },
              { text: "student", value: roles.student },
            ]}
            errorText={formik.errors?.role}
            onSelectOption={(opt) => selectRole(opt.value)}
          />
          <SelectInputApi
            endPoint={
              endPoints[
                formik.values.role === roles.admin
                  ? "admins"
                  : formik.values.role === roles.teacher
                  ? "teachers"
                  : "students"
              ]
            }
            label="profile"
            optionLabel={(opt) => `${opt.firstName} ${opt.lastName}`}
            placeholder={
              formik.values?.profileId
                ? `${formik.values?.profileId?.firstName} ${formik.values?.profileId?.lastName}`
                : `select ${formik.values.role || "student"} profile`
            }
            onChange={(opt) => formik.setFieldValue("profileId", opt)}
          />
        </div>
        <Button type="submit" isSending={handleSubmit.isPending}>
          {language?.exams?.save_btn}
        </Button>
      </form>
    </div>
  );
};

export default AddUser;
