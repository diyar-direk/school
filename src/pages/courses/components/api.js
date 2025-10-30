import { endPoints } from "../../../constants/endPoints";
import axiosInstance from "../../../utils/axios";

export const getAllAttendance = async ({ ...params }) => {
  try {
    const { data } = await axiosInstance.get(endPoints.attendances, {
      params: { ...params },
    });

    return data.data;
  } catch {}
};

export const addAttendance = async (data) => {
  try {
    await axiosInstance.post(endPoints.attendances, data);
  } catch {}
};
export const updateAttendance = async ({ status, id }) => {
  try {
    await axiosInstance.patch(`${endPoints.attendances}/${id}`, { status });
  } catch {}
};
