import dayjs from "dayjs";
import localeFr from "dayjs/locale/fr";
import weekday from "../../node_modules/dayjs/plugin/weekday";
import weekOfYear from "../../node_modules/dayjs/plugin/weekOfYear";
import isBetween from "../../node_modules/dayjs/plugin/isBetween";


dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(isBetween);

function getWeekday(date) {
    return dayjs(date).weekday();
  }

export function setFirstCharUppercase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getCurrentMonth() {
  let res = dayjs().locale(localeFr).format("M");
  return res;
}

export function getCurrentYear() {
  return dayjs().format("YYYY");
}

function getNumberOfDaysInMonth(year, month) {
    return dayjs(`${year}-${month}-01`).daysInMonth();
  }

export function createDaysForCurrentMonth(year, month) {
  return [...Array(getNumberOfDaysInMonth(year, month))].map((day, index) => {
    return {
      date: dayjs(`${year}-${month}-${index + 1}`).format("YYYY-MM-DD"),
      dayOfMonth: index + 1,
      isCurrentMonth: true
    };
  });
}

export function createDaysForPreviousMonth(year, month, currentMonthDays) {
    const firstDayOfTheMonthWeekday = getWeekday(currentMonthDays[0].date);
  
    const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, "month");
  
    // Cover first day of the month being sunday (firstDayOfTheMonthWeekday === 0)
    const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday
      ? firstDayOfTheMonthWeekday - 1
      : 6;
  
    const previousMonthLastMondayDayOfMonth = dayjs(currentMonthDays[0].date)
      .subtract(visibleNumberOfDaysFromPreviousMonth, "day")
      .date();
  
    return [...Array(visibleNumberOfDaysFromPreviousMonth)].map((day, index) => {
      return {
        date: dayjs(
          `${previousMonth.year()}-${previousMonth.month() + 1}-${
            previousMonthLastMondayDayOfMonth + index
          }`
        ).format("YYYY-MM-DD"),
        dayOfMonth: previousMonthLastMondayDayOfMonth + index,
        isCurrentMonth: false
      };
    });
  }

  export function createDaysForNextMonth(year, month, currentMonthDays) {
    const lastDayOfTheMonthWeekday = getWeekday(
      `${year}-${month}-${currentMonthDays.length}`
    );
  
    const nextMonth = dayjs(`${year}-${month}-01`).add(1, "month");
  
    const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday
      ? 7 - lastDayOfTheMonthWeekday
      : lastDayOfTheMonthWeekday;
  
    return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
      return {
        date: dayjs(
          `${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`
        ).format("YYYY-MM-DD"),
        dayOfMonth: index + 1,
        isCurrentMonth: false
      };
    });
  }

  export function isWeekendDay(dateString) {
    return [6, 0].includes(getWeekday(dateString));
  }

  export function isBetweenDates(d1, d2) {
    let res = false;
    for(const e of d2) {
      res = dayjs(d1).isBetween(e.startDate, e.endDate, null, '[]');
      if(res === true) return res;
    }
    return res;
  }