import { useContext } from "react";
import { Context } from "../../context/Context";
import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import Button from "../../components/buttons/Button";
import { useMutation } from "@tanstack/react-query";
import { formatInputsData } from "../../utils/formatInputsData";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import { endPoints } from "../../constants/endPoints";
const UpdatePassword = () => {
  const context = useContext(Context);
  const { userId } = useParams();

  const nav = useNavigate();

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
      userId,
    },
    validationSchema: yup.object({
      newPassword: yup
        .string()
        .required("password is required")
        .min(6, "password must be more than 5 characters"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword"), null], "Passwords must match")
        .required("Passwords must match"),
    }),
    onSubmit: (values) => handleSubmit.mutate(formatInputsData(values)),
  });
  const handleSubmit = useMutation({
    mutationFn: async (data) => {
      try {
        await axiosInstance.post(endPoints.updatePassword, data);
      } catch {}
    },
    onSuccess: () => nav(-1),
  });

  const language = context?.selectedLang;

  return (
    <div className="container relative">
      <form onSubmit={formik.handleSubmit} className="relative dashboard-form">
        <div className="flex wrap ">
          <Input
            title={language?.users?.password}
            onInput={formik.handleChange}
            value={formik.values.newPassword}
            placeholder={language?.users?.password_placeholder}
            name="newPassword"
            errorText={formik.errors?.newPassword}
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
        </div>
        <Button type="submit" isSending={handleSubmit.isPending}>
          {language?.exams?.save_btn}
        </Button>
      </form>
    </div>
  );
};

export default UpdatePassword;
