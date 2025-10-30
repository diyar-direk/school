import { useParams } from "react-router-dom";
import { endPoints } from "../../../constants/endPoints";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { attendanceStatus } from "../../../constants/enums";
import AddAttendance from "./AddAttendance";
import { getAllAttendance } from "./api";

const Attendance = () => {
  const { id } = useParams();

  const { data } = useQuery({
    queryKey: [endPoints.attendances, id],
    queryFn: () => getAllAttendance({ courseId: id }),
  });

  const groupedData = useMemo(
    () =>
      data?.reduce((acc, item) => {
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
  const [selectedData, setSelectedData] = useState({});

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
        <div
          style={{ background: attendanceStatusIcon[record?.status].bg }}
          onDoubleClick={() =>
            setSelectedData({
              student: record?.studentId,
              date: record.date,
              _id: record._id,
              isUpdate: true,
            })
          }
        >
          {attendanceStatusIcon[record?.status].icon}
        </div>
      ) : (
        <div
          onDoubleClick={() =>
            setSelectedData({
              student: studentData?.[0]?.studentId,
              date: `${year}-${month + 1}-${day}`,
              courseId: id,
              isUpdate: false,
            })
          }
        ></div>
      );
    },
    [month, id, year]
  );
  const onClose = useCallback(() => {
    setSelectedData({});
  }, []);

  return (
    <>
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
      <AddAttendance selectedData={selectedData} onClose={onClose} />
    </>
  );
};

export default Attendance;

export const attendanceStatusIcon = {
  [attendanceStatus.Present]: {
    icon: <i className="fa-solid fa-check" />,
    bg: "green",
  },
  [attendanceStatus.Absent]: {
    icon: <i className="fa-solid fa-xmark" />,
    bg: "#bb1b1b",
  },
  [attendanceStatus.Excused]: {
    icon: <i className="fa-solid fa-hand-point-up" />,
    bg: "orange",
  },
  [attendanceStatus.Late]: {
    icon: <i className="fa-solid fa-exclamation" />,
    bg: "gray",
  },
};
