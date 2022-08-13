import React from 'react'

const CalendarHeader = (props) => (
    <section className="calendar-month-header">
          <span
            onClick={() => props.changeDate(props.date, "left")}
            className="calendar-month-header-selectors"
            id="previous-month-selector"
          >
            {"<"}
          </span>
          <div
            id="selected-month"
            className="calendar-month-header-selected-month"
          >
            {props.currMonthName} {props.currYear}
          </div>
          <span
            onClick={() => props.changeDate(props.date, "right")}
            className="calendar-month-header-selectors"
            id="next-month-selector"
          >
            {">"}
          </span>
        </section>
  )

export default CalendarHeader