import React from "react";
// import

const CalendarHeader = (props) => {

  // added photos locally because of 403 forbidden error on urls
  let pic1 = require("../data/photos/arnaud.jpeg");
  let pic2 = require("../data/photos/alban.jpeg");
  const usersPhotos = [pic1, pic2];

  const getStyle = (color) => {
    const style = {
      content: "",
      width: "35px",
      height: "30px",
      marginLeft: "-15px",
      borderRadius: "5px 0 0 5px",
      backgroundColor: color,
      transform: "translateX(15px)"
  };

  return style;
}

  return (
    <section className="calendar-month-header">
      <div className="users">
        {props.users &&
          props.users.map((user, i) => (
            <>
            <div style={getStyle(user.color)}></div>
              <div className="user-block">
                {/* <img className="user-photo" src={usersPhotos[i]} alt={user.name} /> */}
                <img className="user-photo" src={user.avatar} alt={user.name} /> 
                <span key={user.name}>
                  {user.name}
                </span>
              </div>
            </>
          ))}
      </div>
      <span
        onClick={() => props.changeDate(props.date, "left")}
        className="calendar-month-header-selectors"
        id="previous-month-selector"
      >
        {"<"}
      </span>
      <div id="selected-month" className="calendar-month-header-selected-month">
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
  );
};

export default CalendarHeader;
