import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import * as utils from "../utils/utils";
import localeFr from "dayjs/locale/fr";
import data from "../data/files/exercice-calendar.json";
import CalendarHeader from "./CalendarHeader";

const WEEKDAYS = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];

let picArnaud = require("../data/photos/arnaud.jpeg");
let picAlban = require("../data/photos/alban.jpeg");

const Calendar = ({ givenDate }) => {
  const [date, setDate] = useState(givenDate);
  const [monthYear, setMonthYear] = useState({
    currMonthName: null,
    currYear: null,
  });

  const [calendar, setCalendar] = useState(null);
  const [dataEvents, setDataEvents] = useState(data);

  const [users, setUsers] = useState(null);

  let rowCount = 1;
  let idRow = [];

  // const [rowCount, setRowCount] = useState(1);

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

  const pushIdRow = (obj) => {
    idRow.push(obj);
  };

  const removeIdRow = (id) => {
    let filtered = idRow;
    filtered.filter((e) => e.id !== id);
    idRow = filtered;
  };

  const addRowCount = () => {
    rowCount++;
  };

  const minusRowCount = () => {
    if (rowCount > 1) rowCount--;
  };

  const getIdRow = (id) => {
    return idRow.find((e) => e.id === id);
  };

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

  const getEventStyle = (evt) => {
    let res = [];

    for (const e of evt) {
      const style = {
        backgroundColor: e.event.owner.color,
      };
      if (e.info === "start") {
        let row = rowCount;
        let obj = { id: e.event.id, row: rowCount };
        pushIdRow(obj);
        addRowCount();

        if (e.event.owner.name === "Arnaud") e.event.owner.avatar = picArnaud;
        else e.event.owner.avatar = picAlban;

        res.push({ row: row, evt: e.event, style: style, cname: "start" });
      } else if (e.info === "active") {
        let obj = getIdRow(e.event.id);
        let row;
        if (obj === undefined) {
          let obj = { id: e.event.id, row: rowCount };
          row = obj.row;
          pushIdRow(obj);
          addRowCount();
        } else {
          row = obj.row;
        }

        if (e.event.owner.name === "Arnaud") e.event.owner.avatar = picArnaud;
        else e.event.owner.avatar = picAlban;

        res.push({ row: row, evt: e.event, style: style, cname: "active" });
      } else {
        let obj = getIdRow(e.event.id);
        let row = obj.row;
        removeIdRow();
        minusRowCount();

        if (e.event.owner.name === "Arnaud") e.event.owner.avatar = picArnaud;
        else e.event.owner.avatar = picAlban;

        res.push({ row: row, evt: e.event, style: style, cname: "end" });
      }
    }

    return res;
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
                    const eventInfo = utils.isBetweenDates(
                      day.date,
                      dataEvents
                    );
                    if (eventInfo) {
                      const res = getEventStyle(eventInfo);
                      return (
                        <>
                          <div className="event-day-wrapper">
                            {res.map((e) => {
                              console.log(
                                "id = " +
                                  JSON.stringify(e.evt.id) +
                                  " row = " +
                                  JSON.stringify(e.row)
                              );
                              if (e.cname === "start") {
                                return (
                                  <div
                                    style={e.style}
                                    className={`event-day ${e.cname}`}
                                  >
                                    <img
                                      className="user-photo-event"
                                      src={e.evt.owner.avatar}
                                      alt="user"
                                    />
                                    <span>{e.evt.title}</span>
                                  </div>
                                );
                              } else {
                                return (
                                  <div
                                    style={e.style}
                                    className={`event-day ${e.cname}`}
                                  >
                                    <span></span>
                                  </div>
                                );
                              }
                            })}
                          </div>
                        </>
                      );
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
