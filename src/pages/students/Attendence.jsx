import React, { useEffect, useState } from "react";
import "../../components/table.css";
const Attendence = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  const handleClick = (e) => {
    e.target.classList.toggle("active");
  };
  const [overlay, setOverlay] = useState(false);
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

  let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  function createTH(length) {
    let th = [];
    for (let i = 0; i < length; i++) {
      th.push(<th key={i}>{i + 1}</th>);
    }

    return th;
  }
  const statusClick = () => {
    setOverlay(true);
  };
  window.onclick = () => {
    const overlay = document.querySelector(".overlay");
    overlay && setOverlay(false);
  };

  function completeData(e) {
    let tds = [];
    for (let index = 0; index < daysInMonth; index++) {
      tds.push(
        e.price > 100 && e.price < 300 ? (
          <td key={index} onDoubleClick={statusClick} className="status">
            <i className="true fa-solid fa-check"></i>
          </td>
        ) : e.price > 350 ? (
          <td key={index} onDoubleClick={statusClick} className="status">
            <i className="false fa-solid fa-xmark"></i>
          </td>
        ) : (
          <td key={index} onDoubleClick={statusClick} className="status">
            -
          </td>
        )
      );
    }
    return tds;
  }

  const tr = data.map((e) => {
    return (
      <tr key={e.id}>
        <td>{e.category}</td>

        {completeData(e)}
      </tr>
    );
  });
  
  return (
    <main>
      <div className="dashboard-container">
        {overlay && (
          <div className="overlay">
            <div className="change-status">
              <h1>
                change status for student: <span>diyar direki</span>
              </h1>
              <div className="flex gap-20">
                <div className="true center">
                  <h2>true</h2>
                  <i className="fa-solid fa-check"></i>
                </div>
                <div className="false center">
                  <h2>false</h2>
                  <i className="fa-solid fa-xmark"></i>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="container flex flex-direction gap-20">
          <h1 className="title">students attendence</h1>
          <div className="flex"></div>
          <form className="dashboard-form">
            <div className="flex wrap">
              <div className="flex flex-direction">
                <label>select year</label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    please selecte studant year
                  </div>
                  <article>
                    <h2>option 1</h2>
                  </article>
                </div>
              </div>
              <div className="flex flex-direction">
                <label>select month</label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    please selecte a month
                  </div>
                  <article>
                    <h2>option 1</h2>
                  </article>
                </div>
              </div>
              <div className="flex flex-direction">
                <label>select class</label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    please selecte a class
                  </div>
                  <article>
                    <h2>1</h2>
                    <h2>2</h2>
                    <h2>3</h2>
                    <h2>4</h2>
                    <h2>5</h2>
                    <h2>6</h2>
                  </article>
                </div>
              </div>
            </div>
            <div className="btn">search</div>
          </form>
          <div className="tabel-container">
            <div className="table">
              <h2>Attendence Sheet Of Class One: Section A, April 2019</h2>
              <table className="attendence">
                <thead>
                  <tr>
                    <th>student</th> {createTH(daysInMonth)}
                  </tr>
                </thead>
                <tbody>{tr}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Attendence;
