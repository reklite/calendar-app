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

  let idRow = [];

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
    idRow = idRow.filter((e) => e.id !== id);
  };

  const getIdRow = (id) => {
    return idRow.find((e) => e.id === id);
  };

  const manageRowCount = () => {
    if (idRow.length === 0) return 1;

    let rows = [];
    for (let k of idRow) {
      rows.push(k.row);
    }

    let min = -1;
    let i = 1;
    while (min === -1 && i < 10) {
      if (rows.indexOf(i) === -1) min = i;
      i++;
    }

    return min;
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

  const getBlankDivs = (r) => {
    let blankDiv = [];
    r--;
    if (r === 0) return false;
    for (let i = 0; i < r; i++)
      blankDiv.push(<div className={`event-day`}></div>);
    return blankDiv;
  };

  const getRowSpaces = (evt) => {
    if (evt.length === 1) {
      evt[0].blankDivs = getBlankDivs(evt[0].row);
    } else {
      let rows = evt.map((a) => a.row);
      rows.unshift(0);
      for (let i = rows.length - 1; i > 0; i--) {
        let x = (rows[i] - rows[i - 1]);
        evt[i - 1].blankDivs = x-1 > 0 ? getBlankDivs(x) : false;
      }
    }
    return evt;
  };

  const getEventStyle = (evt) => {
    let res = [];

    for (const e of evt) {
      const bgColor = {
        backgroundColor: e.event.owner.color,
      };

      if (e.event.owner.name === "Arnaud") e.event.owner.avatar = picArnaud;
      else e.event.owner.avatar = picAlban;

      if (e.info === "start") {
        let row = manageRowCount();
        pushIdRow({ id: e.event.id, row: row });

        res.push({
          row: row,
          evt: e.event,
          bgColor: bgColor,
          cname: "start",
          blankDivs: null,
        });
      } else if (e.info === "active") {
        let obj = getIdRow(e.event.id);
        let row;
        if (obj === undefined) {
          let obj = { id: e.event.id, row: manageRowCount() };
          row = obj.row;
          pushIdRow(obj);
        } else {
          row = obj.row;
        }
        res.push({
          row: row,
          evt: e.event,
          bgColor: bgColor,
          cname: "active",
          blankDivs: null,
        });
      } else {
        let obj = getIdRow(e.event.id);
        let row = obj.row;
        removeIdRow(e.event.id);

        res.push({
          row: row,
          evt: e.event,
          bgColor: bgColor,
          cname: "end",
          blankDivs: null,
        });
      }
    }

    if (res.length > 1) {
      res.sort((a, b) => (a.row > b.row ? 1 : -1));
    }

    res = getRowSpaces(res);

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
                            {res.map((e, i) => {
                              let photo = false,
                                title = false;
                              if (e.cname === "start") {
                                photo = (
                                  <img
                                    className="user-photo-event"
                                    src={e.evt.owner.avatar}
                                    alt="user"
                                  />
                                );
                                title = e.evt.title;
                              }

                              return (
                                <>
                                  {e.blankDivs}
                                  <div
                                    style={e.bgColor}
                                    className={`event-day ${e.cname}`}
                                  >
                                    {photo}
                                    <span>{title}</span>
                                  </div>
                                </>
                              );
                            })}
                          </div>
                        </>
                      );
                    } else {
                      return false;
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
