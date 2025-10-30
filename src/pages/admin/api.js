import { endPoints } from "../../constants/endPoints";
import axiosInstance from "../../utils/axios";

export const classCount = async () => {
  try {
    const { data } = await axiosInstance.get(
      `${endPoints.classes}${endPoints.count}`
    );
    return data.numberOfDocuments;
  } catch {}
};
export const coursesCount = async () => {
  try {
    const { data } = await axiosInstance.get(
      `${endPoints.courses}${endPoints.count}`
    );

    return data.numberOfDocuments;
  } catch {}
};
