import React, { useEffect } from "react";
import dayjs from "dayjs";
import { useState } from "react";
import * as utils from "./utils/utils";
import localeFr from "dayjs/locale/fr";
import data from "./data/exercice-calendar.json";

function calculateCalendar(m, y) {
  let currentMonthDays = utils.createDaysForCurrentMonth(y, m);
  let previousMonthDays = utils.createDaysForPreviousMonth(y, m, currentMonthDays);
  let nextMonthDays = utils.createDaysForNextMonth(y, m, currentMonthDays);
  let days = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];

  return(days);
}

function Calendar() {
  const [currentMonthName, setCurrentMonthName] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [calendar, setCalendar] = useState(null);

  const [dataEvents, setDataEvents] = useState(data);

  const WEEKDAYS = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];

  useEffect(() => {
    setCurrentMonthName(utils.setFirstCharUppercase(dayjs(currentDate).locale(localeFr).format("MMMM")))
    setCurrentYear(dayjs(currentDate).format("YYYY"));
    setCalendar(calculateCalendar(currentDate.format("M"), currentDate.format("YYYY")));
  
    setDataEvents(formatData(dataEvents));

    return () => {
      console.log("component destroyed !");
    }
  }, [currentDate])
  
  function recalculateCalendar(date, operator) {
    if(operator === "left") 
      date = dayjs(date).subtract(1, "month");
    if(operator === "right")
      date = dayjs(date).add(1, "month");

    setCurrentDate(date);
  };

  function formatData(data) {
    data.forEach(element => {
      element.startDate = dayjs(element.startDate).format("YYYY-MM-DD");
      element.endDate = dayjs(element.endDate).format("YYYY-MM-DD");
    });

    return data;
  }

  // console.log(dayjs(dataEvents[0].startDate).format("YYYY-MM-DD"));


  return (
    <>
      <h1>Calendrier</h1>
      <div className="calendar-month">
        <section className="calendar-month-header">
          <span
            onClick={() => recalculateCalendar(currentDate, "left")}
            className="calendar-month-header-selectors"
            id="previous-month-selector"
          >
            {"<"}
          </span>
          <div
            id="selected-month"
            className="calendar-month-header-selected-month"
          >
            {currentMonthName} {currentYear}
          </div>
          <span
            onClick={() => recalculateCalendar(currentDate, "right")}
            className="calendar-month-header-selectors"
            id="next-month-selector"
          >
            {">"}
          </span>
        </section>

        <ol id="days-of-week" className="day-of-week">
          {WEEKDAYS.map((day, index) => (
            <li
              key={day}
            >
              {day}
            </li>
          ))}
        </ol>

        <ol id="calendar-days" className="days-grid">

        {calendar && calendar.map((day) => (
          <li
            key={day.date}
            className={"calendar-day " +
            //  `${utils.isWeekendDay(day.dateString) ? "" : ""}` + 
             `${day.isCurrentMonth ? "calendar-day--current" : "calendar-day--not-current"}`}
          ><span>{day.dayOfMonth}</span>
          </li>
        ))}
        </ol>
      </div>
    </>
  );
}

export default Calendar;
