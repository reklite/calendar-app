import React, { useEffect } from "react";
import dayjs from "dayjs";
import { useState } from "react";
import * as utils from "../utils/utils";
import localeFr from "dayjs/locale/fr";
import data from "../data/exercice-calendar.json";
import CalendarHeader from "./CalendarHeader";

const WEEKDAYS = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];

const Calendar = ({ givenDate }) => {
  const [date, setDate] = useState(givenDate);
  const [monthYear, setMonthYear] = useState({currMonthName: null, currYear: null,});
  
  const [calendar, setCalendar] = useState(null);
  const [dataEvents, setDataEvents] = useState(data);

  useEffect(() => {
    setCalendar(calculateCalendar(date.format("M"), date.format("YYYY")));
    setMonthYear(() => updateMonthYear(date));

    return () => {
      console.log("component destroyed !");
    };
  }, [date]);

  // if dataEvents changes
  useEffect(() => {
    setDataEvents(formatEvents(dataEvents));

    return () => {
      console.log("component destroyed !");
    };
  }, [dataEvents]);

  const calculateCalendar = (m, y) => {
    let currentMonthDays = utils.createDaysForCurrentMonth(y, m);
    let previousMonthDays = utils.createDaysForPreviousMonth(
      y,
      m,
      currentMonthDays
    );
    let nextMonthDays = utils.createDaysForNextMonth(y, m, currentMonthDays);
    let calendar = [
      ...previousMonthDays,
      ...currentMonthDays,
      ...nextMonthDays,
    ];
    return calendar;
  };

  const updateMonthYear = (date) => {
    const temp = {};
    temp.currMonthName = utils.setFirstCharUppercase(
      dayjs(date).locale(localeFr).format("MMMM")
    );
    temp.currYear = dayjs(date).format("YYYY");
    return temp;
  };

  const changeDate = (date, operator) => {
    if (operator === "left") date = dayjs(date).subtract(1, "month");
    if (operator === "right") date = dayjs(date).add(1, "month");

    setDate(date);
  };

  const formatEvents = (data) => {
    data.forEach((element) => {
      element.startDate = dayjs(element.startDate).format("YYYY-MM-DD");
      element.endDate = dayjs(element.endDate).format("YYYY-MM-DD");
    });

    return data;
  };

  return (
    <>
      <h1>Calendrier</h1>
      <div className="calendar-month">
        <CalendarHeader
          {...monthYear}
          date={date}
          changeDate={changeDate}
        />

        <ol id="days-of-week" className="day-of-week">
          {WEEKDAYS.map((day) => (
            <li key={day}>{day}</li>
          ))}
        </ol>

        <ol id="calendar-days" className="days-grid">
          {calendar &&
            calendar.map((day) => (
              <>
                {/* <div>ok</div> */}
                <li
                  key={day.date}
                  className={
                    "calendar-day " +
                    `${
                      utils.isBetweenDates(day.date, dataEvents)
                        ? "colorize "
                        : ""
                    }` +
                    `${
                      day.isCurrentMonth
                        ? "calendar-day--current"
                        : "calendar-day--not-current"
                    }`
                  }
                >
                  <span>{day.dayOfMonth}</span>
                </li>
              </>
            ))}
        </ol>
      </div>
    </>
  );
};

export default Calendar;
