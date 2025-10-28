import { useContext, useState } from "react";
import { Context } from "../../context/Context";

const Attendence = () => {
  const context = useContext(Context);
  const [form, setForm] = useState({
    date: "",
    classId: "",
  });
  const language = context?.selectedLang;

  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  return (
    <>
      <div className="container flex flex-direction gap-20">
        <h1 className="title">
          {language.attendance && language.attendance.student_atendance}
        </h1>
        <div className="flex"></div>
        <form className="dashboard-form">
          <div className="flex wrap">
            <div className="flex flex-direction">
              <label htmlFor="date">
                {language.attendance && language.attendance.date}
              </label>
              <input
                onInput={(e) => setForm({ ...form, date: e.target.value })}
                id="date"
                type="month"
                className="inp"
                required
              />
            </div>
          </div>
          <button className="btn">
            {language.attendance && language.attendance.search_btn}
          </button>
        </form>
      </div>
    </>
  );
};

export default Attendence;
