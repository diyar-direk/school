import { useParams } from "react-router-dom";
import { endPoints } from "../../../constants/endPoints";
import APIClient from "../../../utils/ApiClient";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { attendanceStatus } from "../../../constants/enums";

const api = new APIClient(endPoints.attendances);

const Attendance = () => {
  const { id } = useParams();

  const { data } = useQuery({
    queryKey: [endPoints.attendances, id],
    queryFn: () => api.getAll({ page: 1, limit: 1000, courseId: id }),
  });

  const groupedData = useMemo(
    () =>
      data?.data?.reduce((acc, item) => {
        const studentId = item.studentId._id;
        const fullName = `${item.studentId.firstName} ${item.studentId.lastName}`;

        if (!acc[studentId]) {
          acc[studentId] = {
            name: fullName,
            data: [],
          };
        }

        acc[studentId].data.push(item);
        return acc;
      }, {}),
    [data]
  );

  const studentsAttendance = groupedData ? Object.values(groupedData) : [];

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getStatusForDay = useCallback(
    (studentData, day) => {
      const record = studentData.find((item) => {
        const date = new Date(item.date);
        return date.getDate() === day && date.getMonth() === month;
      });

      return record ? (
        <div style={{ background: attendanceStatusIcon[record?.status].bg }}>
          {attendanceStatusIcon[record?.status].icon}
        </div>
      ) : (
        <div></div>
      );
    },
    [month]
  );

  return (
    <div className="attendace-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {studentsAttendance.map((student) => (
            <tr key={student.name}>
              <td>{student.name}</td>
              {days.map((day) => (
                <td key={day}>{getStatusForDay(student.data, day)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;

const attendanceStatusIcon = {
  [attendanceStatus.Present]: {
    icon: <i className="fa-solid fa-check" />,
  },
  [attendanceStatus.Absent]: {
    icon: <i className="fa-solid fa-xmark" />,
    bg: "#bb1b1b",
  },
  [attendanceStatus.Excused]: {
    icon: <i className="fa-solid fa-hand-point-up" />,
  },
  [attendanceStatus.Late]: { icon: <i className="fa-solid fa-exclamation" /> },
};
