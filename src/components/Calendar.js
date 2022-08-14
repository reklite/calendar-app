import React, { useEffect } from "react";
import dayjs from "dayjs";
import { useState } from "react";
import * as utils from "../utils/utils";
import localeFr from "dayjs/locale/fr";
import data from "../data/files/exercice-calendar.json";
import CalendarHeader from "./CalendarHeader";

const WEEKDAYS = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];

let pic1 = require("../data/photos/arnaud.jpeg");
let pic2 = require("../data/photos/alban.jpeg");

const Calendar = ({ givenDate }) => {
  const [date, setDate] = useState(givenDate);
  const [monthYear, setMonthYear] = useState({
    currMonthName: null,
    currYear: null,
  });

  const [calendar, setCalendar] = useState(null);
  const [dataEvents, setDataEvents] = useState(data);

  const [users, setUsers] = useState(null);

  useEffect(() => {
    setCalendar(calculateCalendar(date.format("M"), date.format("YYYY")));
    setMonthYear(updateMonthYear(date));

    return () => {
      console.log("component destroyed !");
    };
  }, [date]);

  // if dataEvents changes
  useEffect(() => {
    const { events, arrUsers } = formatEventsUsers(dataEvents);
    setDataEvents(events);
    setUsers(arrUsers);

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

  const formatEventsUsers = (data) => {
    const arrUsers = [];
    const events = data;
    events.forEach((e) => {
      e.startDate = dayjs(e.startDate).format("YYYY-MM-DD");
      e.endDate = dayjs(e.endDate).format("YYYY-MM-DD");

      // push user in array if no exist
      if (arrUsers.findIndex((x) => x.color === e.owner.color) === -1)
        arrUsers.push(e.owner);
    });

    return { events: events, arrUsers: arrUsers };
  };

  const checkIfEvent = (date) => {
    let eventObj;
    let res;
    // console.log("ici : " + JSON.stringify(dataEvents));

    let found = dataEvents.find((obj) => {
      if (obj.startDate === date) {
        eventObj = obj;
        res = "start";
        console.log(
          `eventstart = ${JSON.stringify(obj.startDate)} = ${JSON.stringify(
            date
          )} = date`
        );
        console.log("obj = " + JSON.stringify(eventObj));
      }
      return obj.startDate === date;
    });

    if (found) {
      const photo = (eventObj.owner.photo =
        eventObj.owner.name === "Arnaud" ? pic1 : pic2);
      const eventName = eventObj.title;
      const style = {
        backgroundColor: eventObj.owner.color,
      };
      return { evt: eventName, photo: photo, style: style };
    } else {
      return { evt: false, photo: false, style: false };
    }

    // TODO
    // Gérer date === endDate et startDate < date > endDate
    // Améliorer la structure

  };

  return (
    <>
      <div className="calendar-month">
        <CalendarHeader
          users={users}
          {...monthYear}
          date={date}
          changeDate={changeDate}
        />

        <ol className="day-of-week">
          {WEEKDAYS.map((day) => (
            <li key={day}>{day}</li>
          ))}
        </ol>

        <ol className="days-grid">
          {calendar &&
            calendar.map((day) => (
              <>
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
                  <div className="calendar-day-wrapper">
                    <span className="calendar-day-number">
                      {day.dayOfMonth}
                    </span>
                  </div>
                  {(() => {
                    if (utils.isBetweenDates(day.date, dataEvents)) {
                      const { evt, photo, style } = checkIfEvent(day.date);
                      console.log("evt = " + evt);
                      if (evt !== false) {
                        return (
                          <>
                            <div className="event-day-wrapper">
                              <div style={style} className="event-day start">
                                <img
                                  className="user-photo-event"
                                  src={photo}
                                  alt="user"
                                />
                                <span>{evt}</span>
                              </div>
                              <div className="event-day start" style={style}>
                                <img
                                  className="user-photo-event"
                                  src={photo}
                                  alt="user"
                                />
                                <span>{evt}</span>
                              </div>
                            </div>
                          </>
                        );
                      }
                      return <div></div>;
                    } else {
                      return <span></span>;
                    }
                  })()}
                </li>
              </>
            ))}
        </ol>
      </div>
    </>
  );
};

export default Calendar;
