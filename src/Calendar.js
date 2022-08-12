import React from "react";

function Calendar() {
  return (
    <>
      <h1>Calendrier</h1>
      <div className="calendar-month">
        <section className="calendar-month-header">
          <span
            className="calendar-month-header-selectors"
            id="previous-month-selector"
          >{"<"}
          </span>
          <div id="selected-month" className="calendar-month-header-selected-month">
            February 2020
          </div>
          <span
            className="calendar-month-header-selectors"
            id="next-month-selector"
          >
            {">"}
          </span>

          {/* <div className="calendar-month-header-selectors">
      <span id="previous-month-selector">{'<'}</span>
      <span id="present-month-selector">Today</span>
      <span id="next-month-selector">{'>'}</span>
    </div> */}
        </section>

        <ol id="days-of-week" className="day-of-week">
          <li>Lun.</li>
          <li>Mar.</li>
          <li>Mer.</li>
          <li>Jeu.</li>
          <li>Ven.</li>
          <li>Sam.</li>
          <li>Dim.</li>
        </ol>

        <ol id="calendar-days" className="days-grid">
          <li className="calendar-day">
            <span>1</span>
          </li>
          <li className="calendar-day">
            <span>2</span>
          </li>
          <li className="calendar-day">
            <span>3</span>
          </li>
          <li className="calendar-day">
            <span>4</span>
          </li>
          <li className="calendar-day">
            <span>5</span>
          </li>
          <li className="calendar-day">
            <span>6</span>
          </li>
          <li className="calendar-day">
            <span>7</span>
          </li>
          <li className="calendar-day">
            <span>8</span>
          </li>
          <li className="calendar-day">
            <span>9</span>
          </li>
          <li className="calendar-day">
            <span>10</span>
          </li>
          <li className="calendar-day">
            <span>11</span>
          </li>
          <li className="calendar-day">
            <span>12</span>
          </li>
          <li className="calendar-day">
            <span>13</span>
          </li>
          <li className="calendar-day">
            <span>14</span>
          </li>
          <li className="calendar-day">
            <span>15</span>
          </li>
          <li className="calendar-day">
            <span>16</span>
          </li>
          <li className="calendar-day">
            <span>17</span>
          </li>
          <li className="calendar-day">
            <span>18</span>
          </li>
          <li className="calendar-day">
            <span>19</span>
          </li>
          <li className="calendar-day">
            <span>20</span>
          </li>
          <li className="calendar-day">
            <span>21</span>
          </li>
          <li className="calendar-day">
            <span>22</span>
          </li>
          <li className="calendar-day">
            <span>23</span>
          </li>
          <li className="calendar-day">
            <span>24</span>
          </li>
          <li className="calendar-day">
            <span>25</span>
          </li>
          <li className="calendar-day">
            <span>26</span>
          </li>
          <li className="calendar-day">
            <span>27</span>
          </li>
          <li className="calendar-day">
            <span>28</span>
          </li>
          <li className="calendar-day">
            <span>29</span>
          </li>
        </ol>
      </div>
    </>
  );
}

export default Calendar;
