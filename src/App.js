import './styles/App.css'
import Calendar from './components/Calendar';
import dayjs from "dayjs";

function App() {

  // const currentDate = dayjs();
  const d = new Date(2022, 1, 15);
  let givenDate = dayjs(d);

  return (
    <div className="App">
      <Calendar givenDate={givenDate}/>
    </div>
  );
}

export default App;
